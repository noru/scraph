import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import * as d3 from 'd3'
import { useCommandCenter } from '../../../CommandCenter'
import { CMD, Params } from '../../../CommandCenter'
import clsx from 'clsx'
import classes from '@/style.module.scss'
import { GraphNode } from '@/Workspace/store/graph'
import { useNode, useSelectedElement, useWatchWorkspaceState, useWorkspaceState } from '@/Workspace/store'
import { intersectLinePolygon, Line2D, Point2D } from './utils'
import { useObservable } from 'use-mobx-observable'
import { TempEdge } from './Edge'

interface Props {
  id: string
  renderNode?: (node: GraphNode) => ReactNode
}

export function Node({ id, renderNode }: Props) {
  let ref = useRef<SVGGElement>(null)
  let node = useNode(id)
  let position  = useObservable(() => ({
    showOverlay: false,
    connecting: false,
    get x() {
      return node.x ?? 0
    },
    get y() {
      return node.y ?? 0
    },
    offsetX: 0,
    offsetY: 0,
    get transform() {
      return `translate(${this.x ?? 0}, ${this.y ?? 0}) rotate(0)`
    }
  }))
  let selectedElement = useSelectedElement()
  let cmd = useCommandCenter()

  let onDrag = useCallback((evt) => {
    let payload = {
      id: node.id,
      x: evt.x + position.offsetX,
      y: evt.y + position.offsetY,
    }
    cmd.dispatch(CMD.UpdateNode, { payload })
  }, [id, node.id])

  let onDragStart = useCallback((evt) => {
    Object.assign(position, {
      offsetX: (node.x ?? 0) - evt.x,
      offsetY: (node.y ?? 0) - evt.y,
    })
    // move current element to the top
    // fixme: without setTimeout, onClick will stop working, why?
    setTimeout(() => {
      ref.current?.parentElement?.parentElement?.appendChild(ref.current.parentElement)
    }, 200)
  }, [node.id, node.x, node.y])

  let onDragEnd = useCallback((evt) => {
    if (
      Math.abs(evt.x + position.offsetX - position.x) < 4 &&
      Math.abs(evt.y + position.offsetY - position.y) < 4
    ) {
      return // skip micro movement
    }
    cmd.dispatch(CMD.NodeDragEnd, {
      payload: {
        dragStartPos: { ...position },
        dragEndPos: {
          x: evt.x + position.offsetX,
          y: evt.y + position.offsetY,
        },
      },
      undo: (_, params?: Params) => {
        if (!params) {
          return
        }
        let payload = {
          id: node.id,
          x: params.payload.dragStartPos.x,
          y: params.payload.dragStartPos.y,
        }
        cmd.dispatch(CMD.UpdateNode, { payload })
      },
      redo: (_, params?: Params) => {
        if (!params) {
          return
        }
        let payload = {
          id: node.id,
          x: params.payload.dragEndPos.x,
          y: params.payload.dragEndPos.y,
        }
        cmd.dispatch(CMD.UpdateNode, { payload })
      },
    })
    position.offsetX = 0
    position.offsetY = 0
  }, [node.id, cmd])


  let onConnectionStart = useCallback((evt) => {
    position.connecting = true
    let payload = {
      id: TempEdge,
      source: node.id,
      target: 'unset',
      start: {
        x: evt.x + node.x,
        y: evt.y + node.y,
      },
      end: {
        x: evt.x + node.x,
        y: evt.y + node.y,
      },
    }
    cmd.dispatch(CMD.CreateEdge, { payload })
  }, [node.id, node.x, node.y, cmd])

  let onConnection = useCallback((evt) => {
    let payload = {
      id: TempEdge,
      end: {
        x: evt.x + node.x,
        y: evt.y + node.y,
      },
    }
    cmd.dispatch(CMD.UpdateEdge, { payload })
  }, [id, node.id, node.x, node.y, cmd])

  let onConnectionEnd = useCallback((_) => {
    position.connecting = false
    let wsInfo = cmd.getWorkspaceInfo()
    cmd.exec(CMD.DeleteEdge, { payload: TempEdge })
    let target = cmd.getNodeById(wsInfo.hoverElement?.id)
    if (target && target.connectable && target.id !== node.id) {
      let payload = {
        id: `${node.id}-${target.id}`,
        source: node.id,
        target: target.id,
        start: null,
        end: null,
      }
      cmd.dispatch(CMD.CreateEdge, {
        payload,
        undo: (_, params) => cmd.dispatch(CMD.DeleteEdge, { payload: params?.payload.id }),
      })
    }
  }, [node.id, cmd])

  let setHoverNode = useCallback((id) => {
    position.showOverlay = !!id
    let payload = id ? { id, type: 'node' } : null
    cmd.exec(CMD.HoverElement, { payload })
  }, [node.id, cmd])

  useEffect(() => {
    let instance = d3.select(ref.current)
      .on('mouseenter', () => setHoverNode(node.id))
      .on('mouseleave', () => setHoverNode(null))
    if (!node.draggable) {
      return
    }
    const dragFunc = d3
      .drag()
      .on('drag', onDrag)
      .on('start', onDragStart)
      .on('end', onDragEnd)
    instance.call(dragFunc)
    return () => instance
      .on('mouseenter', null)
      .on('mouseleave', null)
      .on('drag', null)
      .on('start', null)
      .on('edn', null)
  }, [node.draggable])

  useLayoutEffect(() => {
    let { width, height } = d3.select(ref.current).node().getBBox()
    let payload = {
      id: node.id,
      width,
      height,
    }
    cmd.dispatch(CMD.UpdateNode, { payload })
  }, [])

  return (
    <g className={clsx(classes['scraph-node-wrapper'])} id={'_' + node.id}>
      <g
        ref={ref}
        className={clsx(node.draggable && classes['scraph-node-draggable'])}
        transform={position.transform}
        onClick={() => {
          cmd.dispatch(CMD.ClickNode, { payload: node })
          if (node.selectable) {
            if (selectedElement?.id === node.id) {
              cmd.dispatch(CMD.DeselectNode, { payload: node })
            } else {
              cmd.dispatch(CMD.SelectNode, { payload: node })
            }
          }
        }}
      >
        { renderNode ?
          renderNode(node) :
          <rect
            width={node.width ?? 100}
            height={node.height ?? 100}
            stroke="none"
            strokeWidth="0"
            fill="red"
          />
        }
      </g>
      <Overlay 
        node={node} 
        show={position.showOverlay && !position.connecting}
        connecting={position.connecting}
        onConnectionStart={onConnectionStart}
        onConnection={onConnection}
        onConnectionEnd={onConnectionEnd}
      />
    </g>
  )
}

interface OverlayProps {
  node: GraphNode
  show: boolean
  connecting: boolean
  onConnectionStart: (evt: any) => void
  onConnection: (evt: any) => void
  onConnectionEnd: (evt: any) => void
}
function Overlay({ node, show, connecting, onConnectionStart, onConnection, onConnectionEnd }: OverlayProps) {
  let overlay = useRef({
    padding: 8,
    anchorR: 6,
    anchorStrokeWidth: 4,
  })
  let transform = `translate(${node.x ?? 0}, ${node.y ?? 0}) rotate(0)`
  let ref = useRef<SVGGElement>(null)
  let anchorRef = useRef<SVGCircleElement>(null)
  let [scale] = useWatchWorkspaceState(s => s.scale)
  let [borderHover, setHover] = useState(false)
  let [anchorPos, setAnchorPos] = useState<Point2D>({ x: 0, y: 0})

  useEffect(() => {
    d3.select(ref.current)
      .on('mouseenter', () => setHover(true))
      .on('mouseleave', () => setHover(false))
      .on('mousemove', (evt) => {
        let [x, y] = d3.pointer(evt);
        let cx = node.width! / 2
        let cy = node.height! / 2
        let tan = Math.abs((x - cx) / (y - cy))
        let dx = 1000
        let dy = dx / tan
        x += x > cx ? dx : -dx
        y += y > cy ? dy : -dy
        let line = [{ x, y }, { x: cx, y: cy }] as Line2D
        let padding = overlay.current.padding
        let poly = [
          { x: -padding, y: -padding },
          { x: node.width! + padding, y: -padding },
          { x: node.width! + padding, y: node.height! + padding},
          { x: -padding, y: node.height! + padding },
        ]
        let { points } = intersectLinePolygon(line, poly)
        points[0] && setAnchorPos(points[0])
      })

    let dragFunc = d3.drag()
      .on('start', onConnectionStart)
      .on('drag', onConnection)
      .on('end', onConnectionEnd)
    let instance = d3.select(anchorRef.current)
      .call(dragFunc)

    return instance
      .on('mouseenter', null)
      .on('mouseleave', null)
      .on('drag', null)
      .on('start', null)
      .on('edn', null)
  }, [])

  return (
    (node.width && node.height) 
    ?
    <g 
      ref={ref}
      transform={transform}
    >
      { 
        (show || borderHover) &&
        <rect
          x={-overlay.current.padding}
          y={-overlay.current.padding}
          width={node.width + overlay.current.padding * 2}
          height={node.height + overlay.current.padding * 2}
          stroke="#aaa"
          strokeWidth={2 / scale}
          fill="none"
        />
      }
      { node.connectable && 
        <>
          <rect
            x={-overlay.current.padding}
            y={-overlay.current.padding}
            width={node.width + overlay.current.padding * 2}
            height={node.height + overlay.current.padding * 2}
            stroke="transparent"
            strokeWidth={Math.max(10 / scale, 10)}
            fill="none"
          />
          <circle
            ref={anchorRef}
            r={overlay.current.anchorR / scale}
            style={{ cursor: 'pointer', display: (connecting || borderHover) ? undefined : 'none' }}
            fill='white'
            stroke='grey'
            strokeWidth={overlay.current.anchorStrokeWidth / scale}
            cx={anchorPos.x}
            cy={anchorPos.y}
          />
        </>
      }
    </g>
    :
    null
  )
}

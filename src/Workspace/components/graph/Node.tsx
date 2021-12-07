import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import * as d3 from 'd3'
import { useCommandCenter } from '../../../CommandCenter'
import { CMD, Params } from '../../../CommandCenter/CommandCenterBase'
import { isCtrlPressed } from '../../../utils/isCtrlPressed'
import clsx from 'clsx'
import classes from '@/style.module.scss'
import { GraphNode } from '@/Workspace/store/graph'
import { useNode, useWorkspaceState } from '@/Workspace/store'
import { WorkspaceIDContext } from '@/Workspace/Workspace'

interface Props {
  id: string
  renderNode?: (node: GraphNode) => ReactNode
}

interface Position {
  x: number
  y: number
  offsetX: number
  offsetY: number
}

export function Node({ id, renderNode }: Props) {
  let ref = useRef<SVGGElement>(null)
  let { id: wsId } = useContext(WorkspaceIDContext)
  let node = useNode(id, wsId)
  let position = useRef<Position>({
    x: node.x ?? 0,
    y: node.y ?? 0,
    offsetX: 0,
    offsetY: 0,
  })
  let transform = `translate(${node.x ?? 0}, ${node.y ?? 0}) rotate(0)`
  let { dragMode, selectedElement } = useWorkspaceState(wsId)
  let cmd = useCommandCenter()

  let onDrag = useCallback((evt) => {
    if (dragMode === 'drag' && !isCtrlPressed(evt.sourceEvent)) {
      let pos = position.current
      let payload = {
        id: node.id,
        x: evt.x + pos.offsetX,
        y: evt.y + pos.offsetY,
      }
      cmd.dispatch(CMD.UpdateNode, { payload })
    } else { // connect
      let payload = {
        id: 'temp-edge',
        end: {
          x: evt.x,
          y: evt.y,
        },
      }
      cmd.dispatch(CMD.UpdateEdge, { payload })
    }
  }, [id, node.id, node.x, node.y, dragMode])

  let onDragStart = useCallback((evt) => {
    if (dragMode === 'drag' && !isCtrlPressed(evt.sourceEvent)) {
      position.current = {
        x: node.x ?? 0,
        y: node.y ?? 0,
        offsetX: (node.x ?? 0) - evt.x,
        offsetY: (node.y ?? 0) - evt.y,
      }
    } else {
      let payload = {
        id: 'temp-edge',
        source: node.id,
        target: 'unset',
        start: {
          x: evt.x,
          y: evt.y,
        },
        end: {
          x: evt.x,
          y: evt.y,
        },
      }
      cmd.dispatch(CMD.CreateEdge, { payload })
    }
    // move current element to the top
    // fixme: without setTimeout, onClick will stop working, why?
    setTimeout(() => {
      ref.current?.parentElement?.parentElement?.appendChild(ref.current.parentElement)
    }, 200)
  }, [node.id, node.x, node.y, dragMode])

  let onDragEnd = useCallback((evt) => {
    if (dragMode === 'drag' && !isCtrlPressed(evt.sourceEvent)) {
      if (
        Math.abs(evt.x + position.current.offsetX - position.current.x) < 4 &&
        Math.abs(evt.y + position.current.offsetY - position.current.y) < 4
      ) {
        return // skip micro movement
      }
      cmd.dispatch(CMD.NodeDragEnd, {
        payload: {
          dragStartPos: { ...position.current },
          dragEndPos: {
            x: evt.x + position.current.offsetX,
            y: evt.y + position.current.offsetY,
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
      position.current.offsetX = 0
      position.current.offsetY = 0
    } else {
      let wsInfo = cmd.getWorkspaceInfo()
      cmd.dispatch(CMD.DeleteEdge, { payload: 'temp-edge' })
      let target = cmd.getNodeById(wsInfo.hoverElement?.id)
      if (target && target.id !== node.id) {
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
    }
  }, [node.id, dragMode])

  let setHoverNode = useCallback((id) => {
    let payload = id ? {
      id,
      type: 'node',
    } : null
    cmd.exec(CMD.HoverElement, { payload })
  }, [node.id])

  useEffect(() => {
    const dragFunc = d3
      .drag()
      .on('drag', onDrag)
      .on('start', onDragStart)
      .on('end', onDragEnd)
    d3.select(ref.current)
      .on('mouseenter', () => setHoverNode(node.id))
      .on('mouseleave', () => setHoverNode(null))
      .call(dragFunc)
  }, [onDrag])

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
    <g className={clsx(classes['scraph-node-wrapper'])}>
      <g
        ref={ref}
        className={clsx(node.draggable && classes['scraph-node-draggable'])}
        transform={transform}
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
      {/* <g transform={transform}>
        <Overlay
          width={node.width || 0}
          height={node.height || 0}
        />
      </g> */}
    </g>
  )
}

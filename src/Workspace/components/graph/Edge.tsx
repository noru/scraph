import React, {
  CSSProperties,
  forwardRef,
  PropsWithChildren,
  useEffect,
  useRef,
} from 'react'
import {
  applyOffset,
  getLine,
  intersectLinePolygon,
  Line2D,
  Point2D,
} from './utils'
import { useCommandCenter } from '../../../CommandCenter'
import { CMD } from '../../../CommandCenter'
import * as d3 from 'd3'
import clsx from 'clsx'
import classes from '@/style.module.scss'
import { useEdge, useNode, useSelectedElements } from '@/Workspace/store'
import { GraphNode } from '@/Workspace/store/graph'

interface Props {
  id: string
}
export function Edge({ id }: PropsWithChildren<Props>) {
  let ref = useRef(null)
  let cmd = useCommandCenter()
  useEffect(() => {
    let setHoverEdge = (id) => {
      let payload = id ? {
        id,
        type: 'edge',
      } : null
      cmd.exec(CMD.HoverElement, { payload })
    }
    d3.select(ref.current)
      .on('mouseenter', () => setHoverEdge(edge.id))
      .on('mouseleave', () => setHoverEdge(null))
    return () => d3.select(ref.current).on('mouseenter', null).on('mouseleave', null)
  }, [])
  let selectedElement = useSelectedElements()
  let edge = useEdge(id)
  let sourceNode = useNode(edge.source)
  let targetNode = useNode(edge.target)
  let sourcePos = edge.start ?? getNodePos(sourceNode) ?? edge.start
  let targetPos = edge.end ?? getNodePos(targetNode) ?? edge.end
  if (!sourcePos || !targetPos) {
    console.warn(`[Workspace] Orphan edge found: ${edge.id}`)
    return null
  }
  let margin = 3
  let sourcePolygon = [
    applyOffset(sourcePos, -margin, -margin),
    applyOffset({
      x: sourcePos.x + (sourceNode?.width ?? 0),
      y: sourcePos.y,
    }, margin, -margin),
    applyOffset({
      x: sourcePos.x + (sourceNode?.width ?? 0),
      y: sourcePos.y + (sourceNode?.height ?? 0),
    }, margin, margin),
    applyOffset({
      x: sourcePos.x,
      y: sourcePos.y + (sourceNode?.height ?? 0),
    }, -margin, margin),
  ]
  let targetPolygon = [
    applyOffset(targetPos, -margin, -margin),
    applyOffset({
      x: targetPos.x + (targetNode?.width ?? 0),
      y: targetPos.y,
    }, margin, -margin),
    applyOffset({
      x: targetPos.x + (targetNode?.width ?? 0),
      y: targetPos.y + (targetNode?.height ?? 0),
    }, margin, margin),
    applyOffset({
      x: targetPos.x,
      y: targetPos.y + (targetNode?.height ?? 0),
    }, -margin, margin),
  ]
  let line: Line2D = [
    sourceNode ? getNodeCenter(sourceNode) : edge.start!,
    targetNode ? getNodeCenter(targetNode) : edge.end!,
  ]
  let start = intersectLinePolygon(line, sourcePolygon).points[0] ?? sourcePos
  let end = intersectLinePolygon(line, targetPolygon).points[0] ?? targetPos

  const selected = !!selectedElement.find(e => e.id === edge.id)

  return (
    <EdgeInternal 
      id={id}
      ref={ref}
      start={start}
      end={end}
      selected={selected}
      onClick={() => {
        let payload = edge
        cmd.dispatch(CMD.ClickEdge, { payload })
        if (selected) {
          cmd.dispatch(CMD.DeselectEdge, { payload })
        } else {
          cmd.dispatch(CMD.SelectEdge, { payload })
        }
      }}
    />
  )
}

interface EdgeInternalProps {
  id: string
  start: Point2D
  end: Point2D
  selected?: boolean
  hoverable?: boolean
  pathStyles?: CSSProperties
  onClick?: () => void
}

export const EdgeInternal = forwardRef<SVGGElement, EdgeInternalProps>(({
  id,
  start,
  end,
  selected = false,
  hoverable = true,
  pathStyles = {},
  onClick = () => void(0)
}, ref) => {

  const pathDescription = getLine([start, end])

  return (
    <g
      id={'_' + id}
      ref={ref}
      className={clsx(classes['scraph-edge-wrapper'])}
      onClick={onClick}
    >
      <path
        className={clsx(classes['scraph-edge'], selected && 'scraph-edge-selected')}
        style={pathStyles}
        d={pathDescription || undefined}
      />
      { hoverable &&
        <path
          className={clsx(classes['scraph-edge-hover-pad'])}
          d={pathDescription || undefined}
        />
      }
    </g>
  )
})

function getNodeCenter(node: GraphNode): Point2D {
  return {
    x: (node.x ?? 0) + (node.width ?? 0) / 2,
    y: (node.y ?? 0) + (node.height ?? 0) / 2,
  }
}

function getNodePos(node: GraphNode | null): Point2D | null {
  if (!node || node?.x === undefined || node?.y === undefined) {
    return null
  }
  return {
    x: node.x,
    y: node.y,
  }
}
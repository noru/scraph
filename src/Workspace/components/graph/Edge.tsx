import React, {
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
import { CMD } from '../../../CommandCenter/CommandCenterBase'
import * as d3 from 'd3'
import clsx from 'clsx'
import classes from '@/style.module.scss'
import { useEdge, useNode, useSelectedElement } from '@/Workspace/store'
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
  let selectedElement = useSelectedElement()
  let edge = useEdge(id)
  let sourceNode = useNode(edge.source)
  let targetNode = useNode(edge.target)
  let sourcePos = getNodePos(sourceNode) ?? edge.start
  let targetPos = getNodePos(targetNode) ?? edge.end
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

  const pathDescription = getLine([start, end])
  const isSelected = selectedElement?.id === edge.id
  return (
    <g
      ref={ref}
      className={clsx(classes['scraph-edge-wrapper'])}
      onClick={() => {
        let payload = edge
        cmd.dispatch(CMD.ClickEdge, { payload })
        if (isSelected) {
          cmd.dispatch(CMD.DeselectEdge, { payload })
        } else {
          cmd.dispatch(CMD.SelectEdge, { payload })
        }
      }}
    >
      <path
        className={clsx(classes['scraph-edge'], isSelected && 'scraph-edge-selected')}
        style={{ pointerEvents: edge.id === 'temp-edge' ? 'none' : undefined }}
        d={pathDescription || undefined}
      />
      <path
        className={clsx(classes['scraph-edge-hover-pad'])}
        d={pathDescription || undefined}
      />
    </g>
  )
}

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
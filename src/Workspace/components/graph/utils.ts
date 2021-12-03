import * as d3 from 'd3'
import { Intersection } from 'kld-intersections'
import { shape } from 'svg-intersections'
import * as dagre from 'dagre'

export interface Point2D {
  x: number,
  y: number,
}

export type Line2D = [Point2D, Point2D]

export type Polygon2D = Point2D[]

export function getTheta(pt1?: Point2D | null, pt2?: Point2D) {
  const xComp = (pt2?.x ?? 0) - (pt1?.x ?? 0)
  const yComp = (pt2?.y ?? 0) - (pt1?.y ?? 0)
  const theta = Math.atan2(yComp, xComp)

  return theta
}

export function getLine(points: Point2D[]) {
  // Provides API for curved lines using .curve() Example:
  // https://bl.ocks.org/d3indepth/64be9fc39a92ef074034e9a8fb29dcce
  // return d3.line()
  //   .curve(d3.curveCardinal)(points)
  return d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y)(points)
}

export function intersectLinePolygon(line: Line2D, poly: Polygon2D) {
  let [start, end] = line
  const l = shape('line', {
    x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y,
  })
  const pathIntersect = Intersection.intersectLinePolygon(
    l.params[0],
    l.params[1],
    poly,
  )
  return pathIntersect
}

export function applyOffset(point: Point2D, x = 0, y = 0) {
  return {
    x: point.x + x,
    y: point.y + y,
  }
}

export function calculateLayout(
  nodes: { id: string, width?: number, height?: number }[],
  edges: { source: string, target: string }[],
  config = {},
) {
  let g = new dagre.graphlib.Graph()
  g.setGraph(Object.assign({
    // full config: https://github.com/dagrejs/dagre/wiki#configuring-the-layout
    ranker: 'network-simplex', // network-simplex, tight-tree or longest-path
    rankdir: 'LR',
    align: 'UL', // UL, UR, DL, or DR
    weight: 100,
    edgesep: 200,
  }, config))
  g.setDefaultEdgeLabel(function() { return {} })
  nodes.forEach(n => {
    g.setNode(n.id, {
      label: '',
      id: n.id,
      width: n.width ?? 100,
      height: n.height ?? 100,
    })
  })
  edges.forEach(e => {
    g.setEdge(e.source, e.target)
  })
  dagre.layout(g)
  return g
}

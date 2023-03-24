import { observable } from 'mobx'
import { Point2D } from '../components/graph/utils'
import keyBy from 'lodash.keyby'

export type ID = string
export type IDList = ID[]

export interface GraphNode extends Partial<Point2D> {
  id: ID
  width?: number,
  height?: number,
  draggable?: boolean,
  connectable?: boolean,
  selectable?: boolean,
  selected?: boolean,
}

export interface GraphEdge {
  id: ID
  source: ID
  target: ID
  // for temp edge
  start?: Point2D
  end?: Point2D
}

export interface GraphStateStore {
  nodes: Map<string, GraphNode>
  edges: Map<string, GraphEdge>
}

export function _getGraphStateStore(): GraphStateStore {
  return observable<GraphStateStore>({
    nodes: observable.map(),
    edges: observable.map(),
  }, undefined, { autoBind: true })
}

export function getDefaultGraphNode(partial: Partial<GraphNode> & Pick<GraphNode, 'id'>): GraphNode {
  return {
    x: undefined,
    y: undefined,
    width: 250,
    height: 90,
    draggable: true,
    connectable: true,
    selectable: true,
    selected: false,
    ...partial,
  }
}

export const ConnectingEdgeStore = observable({
  start: null as (null | Point2D),
  end: null as (null | Point2D),
  get exists() {
    return !!this.start && !!this.end
  },
  clear() {
    this.start = this.end = null
  },
}, {
  start: observable.ref,
  end: observable.ref,
}, { autoBind: true })
import memoize from 'lodash.memoize'
import { useContext } from 'react'
import {
  atom,
  atomFamily,
  RecoilState,
  RecoilValue,
  selector,
} from 'recoil'
import { WorkspaceIDContext } from '../Workspace'
import { Point2D } from '../components/graph/utils'

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

export interface GraphModelFull {
  nodes: GraphNode[]
  edges: GraphEdge[]
  clear?: boolean
}

export interface GraphIDList {
  nodes: IDList
  edges: IDList
}

export interface GraphAtoms {
  nodeIdList: RecoilState<IDList>
  edgeIdList: RecoilState<IDList>
  graphIdList: RecoilValue<GraphIDList>
  nodeFamily: (id: ID) => RecoilState<GraphNode | null>
  edgeFamily: (id: ID) => RecoilState<GraphEdge | null>
}

export const getGraphModelAtoms = memoize((id: string): GraphAtoms => {
  let nodeIdList = atom<IDList>({
    key: 'graph-node-list-atom-' + id,
    default: [],
  })
  let edgeIdList = atom<IDList>({
    key: 'graph-edge-list-atom-' + id,
    default: [],
  })
  let graphIdList = selector<GraphIDList>({
    key: 'graph-all-id-list-atom-' + id,
    get: ({ get }) => {
      return {
        nodes: get(nodeIdList),
        edges: get(edgeIdList),
      }
    },
  })
  let nodeFamily = atomFamily<GraphNode | null, ID>({
    key: 'graph-node-fam-' + id,
    default: null,
  })

  let edgeFamily = atomFamily<GraphEdge | null, ID>({
    key: 'graph-edge-fam-' + id,
    default: null,
  })

  return {
    graphIdList,
    nodeIdList,
    edgeIdList,
    nodeFamily,
    edgeFamily,
  }
})

export function useGraphAtoms(id?: ID) {
  let { id: wsId } = useContext(WorkspaceIDContext)
  id ||= wsId
  return getGraphModelAtoms(id)
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
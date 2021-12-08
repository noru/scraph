import { useContext, useMemo } from 'react'
import { getWorkspaceStore } from './workspace'
import { select, useObservable, useWatch } from 'use-mobx-observable'
import { WorkspaceIDContext } from '../Workspace'


export function useWorkspaceId() {
  return useContext(WorkspaceIDContext).id
}

export function useWorkspaceStore(wsId: string = useWorkspaceId()) {
  return useMemo(() => getWorkspaceStore(wsId), [wsId])
}

export function useWorkspaceConfig(wsId?: string) {
  return useObservable(useWorkspaceStore(wsId).config)
}

export function useGraphState(wsId?: string) {
  return useObservable(useWorkspaceStore(wsId).graph)
}

export function useWorkspaceState(wsId?: string) {
  return useObservable(useWorkspaceStore(wsId).state)
}

export function useMousePositionState(wsId?: string) {
  return useObservable(useWorkspaceStore(wsId).mousePos)
}

export function useNodeIdSet(wsId?: string) {
  let graph = useWorkspaceStore(wsId).graph
  return useWatch(() => graph.nodeIdSet)[0]
}

export function useEdgeIdSet(wsId?: string) {
  let graph = useWorkspaceStore(wsId).graph
  return useWatch(() => graph.edgeIdSet)[0]
}

export function useNode(id: string, wsId?: string) {
  let graph = useWorkspaceStore(wsId).graph
  return useObservable(() => graph.nodeMap[id] || { id }, [id, graph.nodeMap])
}

export function useEdge(id: string, wsId?: string) {
  let graph = useWorkspaceStore(wsId).graph
  return useObservable(() => graph.edgeMap[id] || { id }, [id, graph.edgeMap])
}

export function useSelectedElement(wsId?: string) {
  let state = useWorkspaceStore(wsId).state
  return useObservable(select(state, ['selectedElement']))
}
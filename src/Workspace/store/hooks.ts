import { useContext, useMemo } from 'react'
import { getWorkspaceStore } from './workspace'
import { select, useObservable, useWatch } from 'use-mobx-observable'
import { WorkspaceIDContext } from '../Workspace'


export function useWorkspaceId() {
  return useContext(WorkspaceIDContext).id
}

export function useWorkspaceConfig(wsId: string = useWorkspaceId()) {
  let config = useMemo(() => getWorkspaceStore(wsId).config, [wsId])
  return useObservable(config)
}

export function useGraphState(wsId: string = useWorkspaceId()) {
  let graph = useMemo(() => getWorkspaceStore(wsId).graph, [wsId])
  return useObservable(graph)
}

export function useWorkspaceState(wsId: string = useWorkspaceId()) {
  let config = useMemo(() => getWorkspaceStore(wsId).state, [wsId])
  return useObservable(config)
}

export function useMousePositionState(wsId: string = useWorkspaceId()) {
  let mousePos = useMemo(() => getWorkspaceStore(wsId).mousePos, [wsId])
  return useObservable(mousePos)
}

export function useNodeIdSet(wsId: string = useWorkspaceId()) {
  return useWatch(() => getWorkspaceStore(wsId).graph.nodeIdSet)[0]
}

export function useEdgeIdSet(wsId: string = useWorkspaceId()) {
  return useWatch(() => getWorkspaceStore(wsId).graph.edgeIdSet)[0]
}

export function useNode(id: string, wsId: string = useWorkspaceId()) {
  let graph = useMemo(() => getWorkspaceStore(wsId).graph, [wsId])
  return useObservable(() => graph.nodeMap[id] || { id }, [id, graph.nodeMap])
}

export function useEdge(id: string, wsId: string = useWorkspaceId()) {
  let graph = useMemo(() => getWorkspaceStore(wsId).graph, [wsId])
  return useObservable(() => graph.edgeMap[id] || { id }, [id, graph.edgeMap])
}

export function useSelectedElement(wsId: string = useWorkspaceId()) {
  return useObservable(select(getWorkspaceStore(wsId).state, ['selectedElement']))
}
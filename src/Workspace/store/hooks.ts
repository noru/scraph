import { useContext, useMemo } from 'react'
import { getWorkspaceStore } from './workspace'
import { useObservable, useWatch } from 'use-mobx-observable'
import { WorkspaceIDContext } from '../Workspace'
import { defaultLogger as log } from '@/utils/logger'
import { WorkspaceConfig } from './config'
import { WorkspaceState } from './state'
import { GraphStateStore } from './graph'

const WarnMsgTemplate = (state: string) => `Observing large state (${state})! Only use it when absolute necessary. Consider using watch hooks instead` 

export function useWorkspaceId() {
  return useContext(WorkspaceIDContext).id
}

export function useWorkspaceStore(wsId?: string) {
  let id = useWorkspaceId()
  return useMemo(() => getWorkspaceStore(wsId || id), [wsId])
}

export function useWorkspaceConfig(wsId?: string) {
  log.w(WarnMsgTemplate('Workspace Config'))
  return useObservable(useWorkspaceStore(wsId).config)
}
export function useWatchWorkspaceConfig<P extends (state: WorkspaceConfig) => any>(watcher: P, wsId?: string): [ReturnType<P>, ReturnType<P>?] {
  let state = useWorkspaceStore(wsId).config
  return useWatch(() => watcher(state))
}

export function useGraphState(wsId?: string) {
  log.w(WarnMsgTemplate('Graph State'))
  return useObservable(useWorkspaceStore(wsId).graph)
}
export function useWatchGraphState<P extends (state: GraphStateStore) => any>(watcher: P, wsId?: string): [ReturnType<P>, ReturnType<P>?]{
  let state = useWorkspaceStore(wsId).graph
  return useWatch(() => watcher(state))
}

export function useWorkspaceState(wsId?: string) {
  log.w(WarnMsgTemplate('Workspace State'))
  return useObservable(useWorkspaceStore(wsId).state)
}
export function useWatchWorkspaceState<P extends (state: WorkspaceState) => any>(watcher: P, wsId?: string): [ReturnType<P>, ReturnType<P>?]{
  let state = useWorkspaceStore(wsId).state
  return useWatch(() => watcher(state))
}

export function useMousePositionState(wsId?: string) {
  let state = useWorkspaceStore(wsId).state
  return useWatch(() => state.mousePos)[0]
}

export function useHoveredElement(wsId?: string) {
  let state = useWorkspaceStore(wsId).state
  return useWatch(() => state.hoverElement)[0]
}

export function useSelectedElements(wsId?: string) {
  let state = useWorkspaceStore(wsId).state
  return useWatch(() => state.selectedElement)[0]
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

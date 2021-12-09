import memoize from 'lodash.memoize'
import { _getWorkspaceConfigStore } from './config'
import { _getGraphStateStore } from './graph'
import { _getWorkspaceStateStore } from './state'

function _getWorkspaceStore(wsId: string) {
  return {
    config: _getWorkspaceConfigStore(wsId),
    state: _getWorkspaceStateStore(),
    graph: _getGraphStateStore(),
  }
}

export type WorkspaceStore = ReturnType<typeof _getWorkspaceStore>
export const getWorkspaceStore = memoize(_getWorkspaceStore)
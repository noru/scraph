import ls from 'localstorage-slim'
import { observable } from 'mobx'

const DefaultConfig: WorkspaceConfig = {
  devMode: false,
  backgroundGrid: 'checker',
  canvasSize: 40960,
  maxZoom: 2,
  minZoom: 0.1,
  workspaceWidth: 1024,
  workspaceHeight: 760,
}
export interface WorkspaceConfig {
  devMode: boolean
  backgroundGrid: 'checker' | 'dot' | 'none',
  canvasSize: number,
  maxZoom: number,
  minZoom: number,
  workspaceWidth: number,
  workspaceHeight: number,
}

export function _getWorkspaceConfigStore(wsId: string): WorkspaceConfig {
  let config = ls.get(`workspace-config-${wsId}`) as WorkspaceConfig
  return observable<WorkspaceConfig>(Object.assign({}, DefaultConfig, config || {}), undefined, { autoBind: true })
}

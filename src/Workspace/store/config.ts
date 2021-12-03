import { memoize } from 'lodash'
import {
  atomFamily,
  selectorFamily,
} from 'recoil'
import ls from 'localstorage-slim'

const DefaultConfig: WorkspaceConfig = {
  devMode: false,
  backgroundGrid: 'checker',
  canvasSize: 40960,
  maxZoom: 2,
  minZoom: 0.1,
  multiSelect: false,
  workspaceWidth: 1024,
  workspaceHeight: 760,
}
export interface WorkspaceConfig {
  devMode: boolean
  backgroundGrid: 'checker' | 'dot' | 'none',
  canvasSize: number,
  maxZoom: number,
  minZoom: number,
  multiSelect: boolean,
  workspaceWidth: number,
  workspaceHeight: number,
}

const WorkspaceConfigFamily = atomFamily<WorkspaceConfig, string>({
  key: 'workspace-config-',
  default: (id: string) => {
    let config = ls.get(`workspace-config-ls-${id}`)
    return Object.assign({}, DefaultConfig, config || {})
  },
})

export interface WorkspaceInfo {
  scale: number,
  translateX: number,
  translateY: number,
  dragMode: 'drag' | 'connect',
  hoverElement: { id: string, type: string } | null,
  selectedElement: { id: string, type: string } | null,
}

const WorkspaceInfoFamily = selectorFamily<WorkspaceInfo, string>({
  key: 'workspace-info-',
  get: (id: string) => ({ get }) => {
    let dragMode = get(WorkspaceDragModeFamily(id))
    let hoverElement = get(WorkspaceHoverElementFamily(id))
    let selectedElement = get(WorkspaceSelectedElementFamily(id))
    let transform = get(WorkspaceTransformFamily(id))
    return {
      ...transform,
      dragMode,
      hoverElement,
      selectedElement,
    }
  },
})

const WorkspaceDragModeFamily = atomFamily<WorkspaceInfo['dragMode'], string>({
  key: 'workspace-info-drag-mode',
  default: 'drag',
})

const WorkspaceHoverElementFamily = atomFamily<WorkspaceInfo['hoverElement'], string>({
  key: 'workspace-info-hover-el',
  default: null,
})

const WorkspaceSelectedElementFamily = atomFamily<WorkspaceInfo['selectedElement'], string>({
  key: 'workspace-info-selected-el',
  default: null,
})

const WorkspaceTransformFamily = atomFamily<Pick<WorkspaceInfo, 'scale' | 'translateX' | 'translateY'>, string>({
  key: 'workspace-info-transform',
  default: {
    scale: 1,
    translateX: 0,
    translateY: 0,
  },
})

export interface WorkspaceMousePosition {
  mouseX: number,
  mouseY: number,
}

const WorkspaceMousePositionFamily = atomFamily<WorkspaceMousePosition, string>({
  key: 'workspace-mouse-pos-',
  default: {
    mouseX: 0,
    mouseY: 0,
  },
})

export const getWorkspaceAtoms = memoize((id: string) => {
  let config = WorkspaceConfigFamily(id)
  let info = WorkspaceInfoFamily(id)
  let mousePos = WorkspaceMousePositionFamily(id)
  let transform = WorkspaceTransformFamily(id)
  let dragMode = WorkspaceDragModeFamily(id)
  let hoverElement = WorkspaceHoverElementFamily(id)
  let selectedElement = WorkspaceSelectedElementFamily(id)

  return {
    config,
    info,
    mousePos,
    transform,
    dragMode,
    hoverElement,
    selectedElement,
  }
})

export type WorkspaceAtoms = ReturnType<typeof getWorkspaceAtoms>
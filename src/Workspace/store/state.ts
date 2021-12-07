import { observable } from 'mobx'
import { Point2D } from '../components/graph/utils'

export interface WorkspaceState {
  scale: number
  translateX: number
  translateY: number
  dragMode: 'drag' | 'connect'
  hoverElement: { id: string, type: string } | null
  selectedElement: { id: string, type: string } | null
}

export function _getWorkspaceStateStore(): WorkspaceState {
  return observable<WorkspaceState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
    dragMode: 'drag',
    hoverElement: null,
    selectedElement: null,
  }, undefined, { autoBind: true })
}

export type MousePositionState = Point2D

export function _getMousePositionStore(): MousePositionState {
  return observable<MousePositionState>({
    x: 0,
    y: 0,
  }, undefined, { autoBind: true })
}
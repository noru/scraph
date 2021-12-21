import { observable } from 'mobx'
import { Point2D } from '../components/graph/utils'

export type ElementType = 'node' | 'edge'

export interface WorkspaceState {
  scale: number
  translateX: number
  translateY: number
  hoverElement: { id: string, type: ElementType } | null
  selectedElement: { id: string, type: ElementType } | null
  mousePos: Point2D
}

export function _getWorkspaceStateStore(): WorkspaceState {
  return observable<WorkspaceState>(
    {
      scale: 1,
      translateX: 0,
      translateY: 0,
      hoverElement: null,
      selectedElement: null,
      mousePos: {
        x: 0,
        y: 0,
      },
    },
    {
      mousePos: observable.ref,
      selectedElement: observable.struct,
      hoverElement: observable.struct,
    },
    { autoBind: true },
  )
}
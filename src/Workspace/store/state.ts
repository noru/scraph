import { observable } from 'mobx'
import { Point2D } from '../components/graph/utils'

export type ElementType = 'node' | 'edge'

export interface SelectedElement {
  id: string
  type: ElementType
}

export interface WorkspaceState {
  scale: number
  translateX: number
  translateY: number
  hoverElement: SelectedElement | null
  selectedElement: SelectedElement[]
  multiSelect: boolean
  mousePos: Point2D
}

export function _getWorkspaceStateStore(): WorkspaceState {
  return observable<WorkspaceState>(
    {
      scale: 1,
      translateX: 0,
      translateY: 0,
      hoverElement: null,
      selectedElement: [],
      multiSelect: false,
      mousePos: {
        x: 0,
        y: 0,
      },
    },
    {
      mousePos: observable.ref,
      selectedElement: observable.struct,
      hoverElement: observable.ref,
    },
    { autoBind: true },
  )
}
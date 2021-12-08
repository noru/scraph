import React, {
  useCallback,
  useContext,
} from 'react'
import { WorkspaceIDContext } from '../../Workspace'
import { useCommandCenter } from '../../../CommandCenter'
import { CMD } from '../../../CommandCenter/CommandCenterPublic'
import { useWorkspaceState } from '@/Workspace/store'

const ZoomStep = 0.02

export function GraphControls() {
  let { id } = useContext(WorkspaceIDContext)
  let wsState = useWorkspaceState(id)
  let cmd = useCommandCenter()
  let transform = useCallback((payload) => {
    cmd.dispatch(CMD.CanvasTransform, { payload })
  }, [id])

  let setDragMode = useCallback((payload) => {
    cmd.dispatch(CMD.DragModeChange, { payload })
  }, [id])

  return (
    <div style={{ display: 'inline-block' }}>
      <label>
        <input
          type="radio"
          name="dragMode"
          value="drag"
          checked={wsState.dragMode === 'drag'}
          onChange={(evt) => setDragMode(evt.target.value)}
        />
          Drag
      </label>
      <label>
        <input
          type="radio"
          name="dragMode"
          value="connect"
          checked={wsState.dragMode === 'connect'}
          onChange={(evt) => setDragMode(evt.target.value)}
        />
          Connect
      </label>
      <span>
        <button onClick={() => transform({
          translateX: wsState.translateX,
          translateY: wsState.translateY,
          scale: wsState.scale - ZoomStep,
        })}
        >
          -
        </button>
        <button>{(wsState.scale * 100) | 0}%</button>
        <button onClick={() => transform({
          translateX: wsState.translateX,
          translateY: wsState.translateY,
          scale: wsState.scale + ZoomStep,
        })}
        >
          +
        </button>
        <button onClick={() => transform({
          translateX: 0,
          translateY: 0,
          scale: 1,
        })}
        >
          Reset
        </button>
        <button onClick={() => cmd.dispatch(CMD.ZoomToFit)}>
          Zoom to fit
        </button>
      </span>
    </div>
  )
}
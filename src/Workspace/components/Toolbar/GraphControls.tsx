import React, {
  useCallback,
  useContext,
} from 'react'
import { WorkspaceIDContext } from '../../Workspace'
import { useCommandCenter } from '../../../CommandCenter'
import { CMD } from '../../../CommandCenter'
import { useWatchWorkspaceState } from '@/Workspace/store'

const ZoomStep = 0.02

export function GraphControls() {
  let { id } = useContext(WorkspaceIDContext)
  let [wsState] = useWatchWorkspaceState(({
    translateX, translateY, scale,
  }) => {
    return {
      translateX,
      translateY,
      scale,
    }
  },id)
  let cmd = useCommandCenter()
  let transform = useCallback((payload) => {
    cmd.dispatch(CMD.CanvasTransform, { payload })
  }, [cmd])

  return (
    <div style={{ display: 'inline-block' }}>
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
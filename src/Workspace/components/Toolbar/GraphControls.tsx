import React, {
  useCallback,
  useContext,
} from 'react'
import { useRecoilValue } from 'recoil'
import { WorkspaceIDContext } from '../../Workspace'
import { useWorkspaceAtoms } from '../WorkspaceRoot'
import { useCommandCenter } from '../../../CommandCenter'
import { CMD } from '../../../CommandCenter/CommandCenterBase'

const ZoomStep = 0.02

export function GraphControls() {
  let { id } = useContext(WorkspaceIDContext)
  let { info } = useWorkspaceAtoms()
  let wsInfo = useRecoilValue(info)
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
          checked={wsInfo.dragMode === 'drag'}
          onChange={(evt) => setDragMode(evt.target.value)}
        />
          drag
      </label>
      <label>
        <input
          type="radio"
          name="dragMode"
          value="connect"
          checked={wsInfo.dragMode === 'connect'}
          onChange={(evt) => setDragMode(evt.target.value)}
        />
          connect
      </label>
      <span>
        <button onClick={() => transform({
          translateX: wsInfo.translateX,
          translateY: wsInfo.translateY,
          scale: wsInfo.scale - ZoomStep,
        })}
        >-
        </button>
        <button>{(wsInfo.scale * 100) | 0}%</button>
        <button onClick={() => transform({
          translateX: wsInfo.translateX,
          translateY: wsInfo.translateY,
          scale: wsInfo.scale + ZoomStep,
        })}
        >+
        </button>
        <button onClick={() => transform({
          translateX: 0,
          translateY: 0,
          scale: 1,
        })}
        >Reset
        </button>
        <button onClick={() => cmd.dispatch(CMD.ZoomToFit)}>zoom to fit
        </button>
      </span>
    </div>
  )
}
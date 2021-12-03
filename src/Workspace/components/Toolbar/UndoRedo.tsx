import React from 'react'
import { useRecoilValue } from 'recoil'
import { useCommandCenter } from '../../../CommandCenter'
import { CMD } from '../../../CommandCenter/CommandCenterBase'

export function UndoRedo() {
  let cmd = useCommandCenter()
  let undoStack = useRecoilValue(cmd.undoStackAtom)
  let redoStack = useRecoilValue(cmd.redoStackAtom)

  return (
    <div style={{ display: 'inline-block' }}>
      <button
        disabled={undoStack.length === 0}
        onClick={() => cmd.dispatch(CMD.Undo)}
      >undo</button>
      <button
        disabled={redoStack.length === 0}
        onClick={() => cmd.dispatch(CMD.Redo)}
      >redo</button>
    </div>
  )
}
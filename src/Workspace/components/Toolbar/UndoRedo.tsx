import React from 'react'
import { useObservable } from 'use-mobx-observable'
import { CMD, useCommandCenter } from '@/CommandCenter'

export function UndoRedo() {
  let cmd = useCommandCenter()
  useObservable(cmd.undoStack, cmd.redoStack)

  return (
    <div style={{ display: 'inline-block' }}>
      <button
        disabled={cmd.undoStack.length === 0}
        onClick={() => cmd.dispatch(CMD.Undo)}
      >
        Undo
      </button>
      <button
        disabled={cmd.redoStack.length === 0}
        onClick={() => cmd.dispatch(CMD.Redo)}
      >
        Redo
      </button>
    </div>
  )
}
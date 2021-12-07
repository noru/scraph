import React, { useContext } from 'react'
import JSONTree from 'react-json-tree'
import { useMultiObservable } from 'use-mobx-observable'
import { useCommandCenter } from '../../CommandCenter'
import { WorkspaceIDContext } from '../Workspace'

export function DebugPanel() {
  let { id } = useContext(WorkspaceIDContext)
  let {
    _store: {
      state, config, graph, mousePos,
    }, undoStack, redoStack,
  } = useCommandCenter()

  useMultiObservable(state, config, graph, mousePos)

  return (
    <JSONTree
      data={{
        id: id,
        mousePos,
        config,
        state,
        undoStack,
        redoStack,
        graph,
      }}
      hideRoot
      shouldExpandNode={([key], _, level) => {
        if (key === 'nodes' || key === 'edges' || key === 'undoStack' || key === 'redoStack' || level > 2) {
          return false
        }
        return true
      }}
    />
  )
}
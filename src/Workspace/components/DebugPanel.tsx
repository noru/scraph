import React, { useContext } from 'react'
import { useMultiObservable } from 'use-mobx-observable'
import { useCommandCenter } from '../../CommandCenter'
import { WorkspaceIDContext } from '../Workspace'
import ErrorBoundary from './ErrorBoundary'
import ReactJson from 'react-json-view'

export function DebugPanel() {
  let { id } = useContext(WorkspaceIDContext)
  let {
    _store: {
      state, config, graph,
    }, undoStack, redoStack,
  } = useCommandCenter()

  useMultiObservable(state, config, graph)
  return (
    <ErrorBoundary>
      <ReactJson
        name={null}
        indentWidth={2}
        src={{
          id: id,
          config,
          state,
          undoStack,
          redoStack,
          graph,
        }}
      />
    </ErrorBoundary>
  )
}
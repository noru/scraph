import React, { useContext, useMemo, useState } from 'react'
import { useMultiObservable } from 'use-mobx-observable'
import { useCommandCenter } from '../../CommandCenter'
import { WorkspaceIDContext } from '../Workspace'
import ErrorBoundary from './ErrorBoundary'
import ReactJson from 'react-json-view'
import { deepSearchObject } from '@/utils/deepSearchObject'

export function DebugPanel() {
  let { id } = useContext(WorkspaceIDContext)
  let {
    _store: {
      state, config, graph,
    }, undoStack, redoStack,
  } = useCommandCenter()
  let [query, setQuery] = useState('')
  useMultiObservable(state, config, graph)
  let src = useMemo(() => {
    let data = {
      id,
      config,
      state,
      undoStack,
      redoStack,
      graph,
    }
    if (query) {
      return deepSearchObject(data, query.toLowerCase())
    }
    return data
  }, [id, state, config, graph, query])
  return (
    <ErrorBoundary>
      <input onChange={e => setQuery(e.target.value)} placeholder='Search key/value' style={{ width: '100%' }}/>
      <ReactJson
        name={null}
        indentWidth={2}
        src={src || {}}
        shouldCollapse={({ type }) => {
          if (query) {
            return false
          }
          if (type === 'array') {
            return true
          }
          return false
        }}
      />
    </ErrorBoundary>
  )
}

import React from 'react'
import { getDefaultGraphNode } from '@/Workspace/store/graph'
import { useCommandCenter, CMD } from '@/CommandCenter'
import { GraphControls } from './GraphControls'
import { UndoRedo } from './UndoRedo'
import { useSelectedElements, useWatchWorkspaceState } from '@/Workspace'

export function Toolbar() {
  let cmd = useCommandCenter()
  let selected = useSelectedElements()

  let multiSelect = useWatchWorkspaceState(s => s.multiSelect)[0]
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'flex',
      justifyContent: 'center',
    }}
    >
      <button onClick={() => cmd.dispatch(CMD.RecalculateGraphLayout)}>
        Calculate Layout
      </button>
      <label>
        <input
          type="checkbox"
          name="selectionMode"
          checked={multiSelect}
          onChange={(evt) => cmd._store.state.multiSelect = evt.target.checked}
        />
          MultiSelect
      </label>
      <button
        onClick={() => {
          let id = prompt('Node id') || 'node-id-' + Date.now()
          let payload = getDefaultGraphNode({ id })
          cmd.dispatch(CMD.CreateNode, {
            payload,
            undo: () => cmd.dispatch(CMD.DeleteNode, { payload: id }),
          })
        }}
      >
        Create Node
      </button>
      <button
        onClick={() => {
          let id = prompt('Node id')
          let payload = { id }
          cmd.dispatch(CMD.CenterElement, { payload })
        }}
      >
        Center Element
      </button>
      <button onClick={() => {
        if (!selected.length) {
          return
        }
        selected.forEach(e => {
          cmd.exec(e.type === 'node' ? CMD.DeleteNode : CMD.DeleteEdge, { payload: e.id })
        })
      }}>
        Delete
      </button>
      <button onClick={() => cmd.dispatch(CMD.Clear)}>
        Clear
      </button>
      <button
        onClick={() => {
          let payload = { backgroundGrid: 'dot' }
          cmd.dispatch(CMD.UpdateWorkspaceConfig, { payload })
        }}
      >
        Grid Dot
      </button>
      <button
        onClick={() => {
          let payload = { backgroundGrid: 'checker' }
          cmd.dispatch(CMD.UpdateWorkspaceConfig, { payload })
        }}
      >
        Grid Checker
      </button>
      <button
        onClick={() => {
          let payload = { backgroundGrid: 'none' }
          cmd.dispatch(CMD.UpdateWorkspaceConfig, { payload })
        }}
      >
        No Grid
      </button>
      <UndoRedo />
      <GraphControls />
    </div>
  )
}
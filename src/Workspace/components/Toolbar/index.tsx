import { getDefaultGraphNode } from '@/Workspace/store/graph'
import React from 'react'
import { useCommandCenter } from '../../../CommandCenter'
import { CMD } from '../../../CommandCenter/CommandCenterBase'
import { GraphControls } from './GraphControls'
import { UndoRedo } from './UndoRedo'

export function Toolbar() {
  let cmd = useCommandCenter()
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
        onClick={() => cmd.dispatch(CMD.Clear)}
      >
        Clear
      </button>
      <button
        onClick={() => {
          let payload = {
            backgroundGrid: 'dot',
          }
          cmd.dispatch(CMD.UpdateWorkspaceConfig, { payload })
        }}
      >
        Grid Dot
      </button>
      <button
        onClick={() => {
          let payload = {
            backgroundGrid: 'checker',
          }
          cmd.dispatch(CMD.UpdateWorkspaceConfig, { payload })
        }}
      >
        Grid Checker
      </button>
      <button
        onClick={() => {
          let payload = {
            backgroundGrid: 'none',
          }
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
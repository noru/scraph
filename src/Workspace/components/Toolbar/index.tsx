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
      <button onClick={() => {

        let nodes = [1,2,3,4,5].map(i => ({
          id: i + '',
          x: 0,
          y: 0,
          width: 250,
          height: 90,
          draggable: true,
          connectable: true,
          selectable: true,
        }))
        let partial = nodes.map(n => n.id)
        let edges = [
          { source: '1', target: '2'}, 
          {source: '2', target: '3'},
          {source: '1', target: '4'},
          {source: '4', target: '5'},
        ].map(e => {
          return {
            ...e,
            id: `${e.source}---${e.target}`
          }
        })

        nodes = cmd._store.graph.nodes.concat(nodes) as any
        edges = cmd._store.graph.edges.concat(edges) as any
        nodes.forEach(payload => {
          cmd.exec(CMD.CreateNode, { payload })
        })
        edges.forEach(payload => {
          cmd.exec(CMD.CreateEdge, { payload })
        })
        let payload = { partial }
        cmd.dispatch(CMD.RecalculateGraphLayout, { payload })
      }}>
        test
      </button>
      <button onClick={() => cmd.dispatch(CMD.RecalculateGraphLayout)}>
        Calculate Layout
      </button>
      <button onClick={() => cmd.dispatch(CMD.RecalculateGraphLayout, { payload: { partial: ['0a', 'a'] }})}>
        Calculate Layout (partial)
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
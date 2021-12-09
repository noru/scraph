import {
  isEmpty,
  memoize,
} from 'lodash'
import { isUndefinedOrNull } from '@drewxiu/utils/lib/is'
import { useContext } from 'react'
import { WorkspaceIDContext } from '../Workspace/Workspace'
import {
  CMD,
  CmdHandler,
  CommandCenterPublic,
  Params,
} from './CommandCenterPublic'

import ls from 'localstorage-slim'
import {
  calculateLayout,
  Point2D,
} from '../Workspace/components/graph/utils'
import { WorkspaceState } from '@/Workspace/store/state'
import { WorkspaceConfig } from '@/Workspace/store/config'
import { GraphEdge, GraphNode } from '@/Workspace/store/graph'

// https://github.com/dagrejs/dagre/wiki#configuring-the-layout
type DagreConfig = Record<string, string | number>

class CommandCenter extends CommandCenterPublic {

  constructor(id: string) {
    super(id)
    this.initBuildInActions()
    window[`__workspace_cmd_${id.replace(/[^a-zA-Z0-9]/g, '')}`] = this
  }

  destroy() {
    window[`__workspace_cmd_${this._id.replace(/[^a-zA-Z0-9]/g, '')}`] = null
  }

  initBuildInActions() {
    this.subscribe(CMD.Clear, this.onClear as CmdHandler)
    this.subscribe(CMD.InitGraph, this.onInitGraph as CmdHandler)
    this.subscribe(CMD.CanvasTransform, this.onCanvasTransform as CmdHandler)
    this.subscribe(CMD.UpdateWorkspaceConfig, this.onUpdateWsConfig as CmdHandler)
    this.subscribe(CMD.RecalculateGraphLayout, this.onCalculateGraphLayout as CmdHandler)
    this.subscribe(CMD.DeleteNode, this.onDeleteNode as CmdHandler)
    this.subscribe(CMD.CreateNode, this.onUpsertNode as CmdHandler)
    this.subscribe(CMD.UpdateNode, this.onUpsertNode as CmdHandler)
    this.subscribe(CMD.DeleteEdge, this.onDeleteEdge as CmdHandler)
    this.subscribe(CMD.SelectNode, this.onSelectNode as CmdHandler)
    this.subscribe(CMD.DeselectNode, this.onDeselectNode as CmdHandler)
    this.subscribe(CMD.CreateEdge, this.onUpsertEdge as CmdHandler)
    this.subscribe(CMD.UpdateEdge, this.onUpsertEdge as CmdHandler)
    this.subscribe(CMD.SelectEdge, this.onSelectEdge as CmdHandler)
    this.subscribe(CMD.DeselectEdge, this.onDeselectEdge as CmdHandler)
    this.subscribe(CMD.MouseMove, this.onMouseMove as CmdHandler)
    this.subscribe(CMD.DragModeChange, this.onDragMode as CmdHandler)
    this.subscribe(CMD.HoverElement, this.onHoverElement as CmdHandler)
    this.subscribe(CMD.Undo, this.onUndo as CmdHandler)
    this.subscribe(CMD.Redo, this.onRedo as CmdHandler)
  }

  onClear(_) {
    this._store.graph.nodes.length = 0
    this._store.graph.edges.length = 0
  }

  onInitGraph(_, { payload: { nodes, edges } }) {
    if (isEmpty(nodes)) {
      return
    }
    if (isUndefinedOrNull(nodes[0].x)) {
      let graph = calculateLayout(nodes, edges)
      nodes = nodes.map(n => {
        let { x, y } = graph.node(n.id)
        return {
          ...n,
          x,
          y,
        }
      })
    }
    nodes.forEach(payload => {
      this.onUpsertNode(_, { payload })
    })
    edges.forEach(payload => {
      this.onUpsertEdge(_, { payload })
    })
    setTimeout(() => this.dispatch(CMD.ZoomToFit))
  }

  onCanvasTransform(_: CMD, { payload }: Params<Partial<WorkspaceState>>) {
    if (!isUndefinedOrNull(payload.scale)) {
      let { maxZoom, minZoom } = this._store.config
      if (payload.scale > maxZoom) {
        payload.scale = maxZoom
      }
      if (payload.scale! < minZoom) {
        payload.scale = minZoom
      }
    }
    Object.assign(this._store.state, payload)
  }

  onUpdateWsConfig(_: CMD, { payload }: Params<Partial<WorkspaceConfig>>) {
    Object.assign(this._store.config, payload)
    ls.set('workspace-config-' + this._id, this._store.config)
  }

  onCalculateGraphLayout(_: CMD, { payload }: Params<DagreConfig> = { payload: {} }) {

    let { nodes, edges } = this._store.graph
    let graph = calculateLayout(
      nodes.map(n => ({
        id: n.id,
        width: n.width ?? 0,
        height: n.height ?? 0,
      })),
      edges.map(e => ({
        source: e.source,
        target: e.target,
      })),
      payload,
    )
    graph.nodes().forEach(id => {
      let { x, y } = graph.node(id)
      let payload = {
        id,
        x,
        y,
      }
      this.exec(CMD.UpdateNode, { payload })
    })
  }

  onDeleteNode(_: CMD, { payload }: Params<string>) {
    let node = this._store.graph.nodeMap[payload]
    this._store.graph.nodes['remove'](node) // todo, proper remove element
    if (this._store.state.selectedElement?.id === payload) {
      this._store.state.selectedElement = null
    }
  }

  onUpsertNode(_: CMD, { payload }: Params<GraphNode>) {
    if (isUndefinedOrNull(payload.id)) {
      throw Error(`Invalid node ID: ${payload.id}`)
    }
    let node = this._store.graph.nodeMap[payload.id]
    if (node) {
      Object.assign(node, payload)
    } else {
      if (isUndefinedOrNull(payload.x) || isUndefinedOrNull(payload.y)) {
        let { x, y } = this._getNodeInitPosition(payload.width, payload.height)
        payload.x = x
        payload.y = y
      }
      this._store.graph.nodes.push(payload)
    }
  }

  onSelectNode(_: CMD, { payload }: Params<GraphNode>) {
    this._store.state.selectedElement = {
      id: payload.id,
      type: 'node',
    }
  }

  onDeselectNode(_: CMD, { payload }: Params<GraphNode>) {
    this.clearSelection()
  }

  onUpsertEdge(_: CMD, { payload }: Params<GraphEdge>) {
    if (!payload.id) {
      throw Error(`Invalid edge ID: ${payload.id}`)
    }
    let edge = this._store.graph.edgeMap[payload.id]
    if (edge) {
      Object.assign(edge, payload)
    } else {
      this._store.graph.edges.push(payload)
    }
  }

  onDeleteEdge(_: CMD, { payload }: Params<string>) {
    let edge = this._store.graph.edgeMap[payload]
    this._store.graph.edges['remove'](edge)
    if (this._store.state.selectedElement?.id === payload) {
      this._store.state.selectedElement = null
    }
  }

  onSelectEdge(_: CMD, { payload }: Params<GraphEdge>) {
    this._store.state.selectedElement = {
      id: payload.id,
      type: 'edge',
    }
  }
  onDeselectEdge(_: CMD, { payload }: Params<GraphEdge>) {
    this.clearSelection()
  }
  onUndo() {
    this.undo()
  }
  onRedo() {
    this.redo()
  }
  onMouseMove(_, { payload }) {
    this._store.state.mousePos = payload
  }
  onHoverElement(_, { payload }) {
    this._store.state.hoverElement = payload
  }
  onDragMode(_, { payload }) {
    this._store.state.dragMode = payload
  }
  clearSelection() {
    this._store.state.selectedElement = null
  }
  _getNodeInitPosition(width = 0, height = 0): Point2D {
    let { x, y } = this.getWorkspaceCenter()
    return {
      x: x - width / 2,
      y: y - height / 2,
    }
  }
}

const getCommandCenter = memoize((id: string) => {
  return new CommandCenter(id) as CommandCenterPublic
})

function useCommandCenter(id?: string) {
  let ctx = useContext(WorkspaceIDContext)
  id ||= ctx.id
  return getCommandCenter(id)
}

export {
  CommandCenter,
  getCommandCenter,
  useCommandCenter,
}
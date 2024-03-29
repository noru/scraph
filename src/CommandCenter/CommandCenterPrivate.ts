import { calculateLayout, Point2D } from "@/Workspace/components/graph/utils"
import { WorkspaceConfig } from "@/Workspace/store/config"
import { GraphNode, GraphEdge } from "@/Workspace/store/graph"
import { SelectedElement, WorkspaceState } from "@/Workspace/store/state"
import { getWorkspaceStore, WorkspaceStore } from "@/Workspace/store/workspace"
import { isEmpty, isUndefinedOrNull } from "@drewxiu/utils/lib/is"
import ls from "localstorage-slim"
import { observable } from "mobx"
import { CMD } from './Commands'
import { CmdHandler, Command, Params, Subscribers } from './types'

// https://github.com/dagrejs/dagre/wiki#configuring-the-layout
type DagreConfig = Record<string, string | number> & { partial?: string[] }

export abstract class CommandCenterPrivate {
  abstract id: string
  abstract subscribe(cmd: CMD, ...handlers: CmdHandler[]): void
  abstract dispatch(cmd: CMD, params?: Params<unknown>, delay?: number): void
  abstract exec<T = unknown>(cmd: CMD, params?: Params<T>): void
  abstract clearSelection(): void
  abstract undo(): void
  abstract redo(): void

  _store: WorkspaceStore
  protected _readonly = false
  undoStack: Command[]
  redoStack: Command[]
  protected _subscribers = Object.keys(CMD).reduce((prev, next) => {
    prev[next] = [] as CmdHandler[]
    return prev
  }, {}) as Subscribers
  

  constructor(id: string) {
    this._store = getWorkspaceStore(id)
    this.undoStack = observable([], { deep: false, name: 'undoStack' })
    this.redoStack = observable([], { deep: false, name: 'redoStack' })
    this.initBuildInActions()
  }

  private initBuildInActions() {
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
    this.subscribe(CMD.HoverElement, this.onHoverElement as CmdHandler)
    this.subscribe(CMD.Undo, this.onUndo as CmdHandler)
    this.subscribe(CMD.Redo, this.onRedo as CmdHandler)
  }

  private onClear(_) {
    this._store.graph.nodes.clear()
    this._store.graph.edges.clear()
  }

  private onInitGraph(_, { payload: { nodes, edges } }) {
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

  private onCanvasTransform(_: CMD, { payload }: Params<Partial<WorkspaceState>>) {
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

  private onUpdateWsConfig(_: CMD, { payload }: Params<Partial<WorkspaceConfig>>) {
    Object.assign(this._store.config, payload)
    ls.set('workspace-config-' + this.id, this._store.config)
  }

  private onCalculateGraphLayout(_: CMD, { payload }: Params<DagreConfig> = { payload: {} }) {

    let { nodes: nodeMap, edges: edgeMap } = this._store.graph
    let offsetX: any = null
    let offsetY: any = null

    let nodes = Array.from(nodeMap.values())
    let edges = Array.from(edgeMap.values())
    if (payload.partial) {
      let idSet = new Set(payload.partial)
      nodes = nodes.filter(n => {
        if (idSet.has(n.id))
          return true
        if (offsetX == null || n.x! < offsetX) offsetX = n.x! - (n.width || 0) / 2
        if (offsetY == null || n.y! > offsetY) offsetY = n.y! + (n.height || 0) / 2
        return false
      })
      edges = edges.filter(e => idSet.has(e.target) && idSet.has(e.source))
    }
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
      let node = graph.node(id)
      if (!node) return
      let payload = {
        id,
        x: node.x + (offsetX || 0),
        y: node.y + (offsetY || 0) + 150,
      }
      this.exec(CMD.UpdateNode, { payload })
    })
  }

  private onDeleteNode(_: CMD, { payload }: Params<string>) {
    this._store.graph.nodes.delete(payload)
    if (this._store.state.selectedElement.find(i => i.id === payload)) {
      this._store.state.selectedElement = this._store.state.selectedElement.filter(e => e.id !== payload)
    }
  }

  private onUpsertNode(_: CMD, { payload }: Params<GraphNode>) {
    if (isUndefinedOrNull(payload.id)) {
      throw Error(`Invalid node ID: ${payload.id}`)
    }
    let node = this._store.graph.nodes.get(payload.id)
    if (node) {
      Object.assign(node, payload)
    } else {
      if (isUndefinedOrNull(payload.x) || isUndefinedOrNull(payload.y)) {
        let { x, y } = this.getNodeInitPosition(payload.width, payload.height)
        payload.x = x
        payload.y = y
      }
      this._store.graph.nodes.set(payload.id, payload)
    }
  }

  private onSelectNode(_: CMD, { payload }: Params<GraphNode>) {
    let selected: SelectedElement = {
      id: payload.id,
      type: 'node',
    }
    let multiSelect = this._store.state.multiSelect
    if (multiSelect) {
      this.addSelected(selected)
    } else {
      this._store.state.selectedElement = [selected]
    }
  }

  private onDeselectNode(_: CMD, { payload }: Params<GraphNode>) {
    this.removeSelected(payload.id)
  }

  private onUpsertEdge(_: CMD, { payload }: Params<GraphEdge>) {
    if (!payload.id) {
      throw Error(`Invalid edge ID: ${payload.id}`)
    }
    let edge = this._store.graph.edges.get(payload.id)
    if (edge) {
      Object.assign(edge, payload)
    } else {
      this._store.graph.edges.set(payload.id, payload)
    }
  }

  private onDeleteEdge(_: CMD, { payload }: Params<string>) {
    this._store.graph.edges.delete(payload)
    if (this._store.state.selectedElement.find(i => i.id === payload)) {
      this._store.state.selectedElement = this._store.state.selectedElement.filter(e => e.id !== payload)
    }
  }

  private onSelectEdge(_: CMD, { payload }: Params<GraphEdge>) {
    let selected: SelectedElement = {
      id: payload.id,
      type: 'edge',
    }
    let multiSelect = this._store.state.multiSelect
    if (multiSelect) {
      this.addSelected(selected)
    } else {
      this._store.state.selectedElement = [selected]
    }
  }
  private onDeselectEdge(_: CMD, { payload }: Params<GraphEdge>) {
    this.removeSelected(payload.id)
  }
  private findSelectedIndex(id: string) {
    return this._store.state.selectedElement.findIndex(i => i.id === id)
  }
  private addSelected(selected: SelectedElement) {
    if (this.findSelectedIndex(selected.id) === -1) {
      this._store.state.selectedElement = [...this._store.state.selectedElement, selected]
    }
  }
  private removeSelected(id: string) {
    if (this.findSelectedIndex(id) === -1) {
      this._store.state.selectedElement = this._store.state.selectedElement.filter(i => i.id !== id)
    }
  }
  private onUndo() {
    this.undo()
  }
  private onRedo() {
    this.redo()
  }
  private onMouseMove(_, { payload }) {
    this._store.state.mousePos = payload
  }
  private onHoverElement(_, { payload }) {
    this._store.state.hoverElement = payload
  }
  private getNodeInitPosition(width = 0, height = 0): Point2D {
    let { x, y } = this.getWorkspaceCenter()
    return {
      x: x - width / 2,
      y: y - height / 2,
    }
  }
  private getWorkspaceCenter() {
    let { workspaceWidth = 0, workspaceHeight = 0 } = this._store.config
    let {
      scale, translateX, translateY,
    } = this._store.state
    return {
      x: (workspaceWidth / 2 - translateX) / scale,
      y: (workspaceHeight / 2 - translateY) / scale,
    }
  }
}
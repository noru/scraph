import { produceMerge } from '@/utils/produce'
import {
  isEmpty,
  memoize,
} from 'lodash'
import { isUndefinedOrNull } from '@drewxiu/utils/lib/is'
import { useContext } from 'react'
import { WorkspaceIDContext } from '../Workspace/Workspace'
import {
  GraphEdge,
  IDList,
  GraphModelFull,
  GraphNode,
} from '../Workspace/hooks/useGraphAtoms'
import {
  WorkspaceConfig,
  WorkspaceInfo,
} from '../Workspace/store/config'
import {
  CMD,
  CmdHandler,
  CommandCenter,
  Params,
} from './CommandCenterBase'
import {
  getRecoil,
  setRecoil,
  recoilTransaction,
  RecoilSetter,
  RecoilResetter,
} from '@/utils/RecoilNexus'
import ls from 'localstorage-slim'
import {
  calculateLayout,
  Point2D,
} from '../Workspace/components/graph/utils'
import { produce } from '../utils/produce'
import { removeElementFromArray } from '../utils/removeElementFromArray'

// https://github.com/dagrejs/dagre/wiki#configuring-the-layout
type DagreConfig = Record<string, string | number>

class CommandCenterInternal extends CommandCenter {

  constructor(id: string) {
    super(id)
    this.initBuildInActions()
    window[`__workspace_cmd_${id.replace(/[^a-zA-Z0-9]/g, '')}`] = this
    // todo, destroy cmd
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

  onClear(_, resetter?: RecoilResetter) {
    let model = getRecoil(this._graphAtoms.graphIdList)
    let exec = resetter => {
      model.nodes.forEach(id => resetter(this._graphAtoms.nodeFamily(id)))
      model.edges.forEach(id => resetter(this._graphAtoms.edgeFamily(id)))
      resetter(this._graphAtoms.nodeIdList)
      resetter(this._graphAtoms.edgeIdList)
    }
    resetter ? exec(resetter) : recoilTransaction(({ reset }) => exec(reset))
  }

  onInitGraph(_, {
    payload: {
      nodes, edges, clear,
    },
  }: Params<GraphModelFull>) {
    clear && this.onClear(CMD.Clear)
    if (isEmpty(nodes)) {
      return
    }
    recoilTransaction(({ set }) => {
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
        this.onUpsertNode(_, { payload }, set)
      })
      edges.forEach(payload => {
        this.onUpsertEdge(_, { payload }, set)
      })
    })
    setTimeout(() => this.dispatch(CMD.ZoomToFit))
  }

  onCanvasTransform(_: CMD, { payload }: Params<Partial<WorkspaceInfo>>) {
    if (!isUndefinedOrNull(payload.scale)) {
      let { maxZoom, minZoom } = getRecoil(this._workspaceAtoms.config)
      if (payload.scale > maxZoom) {
        payload.scale = maxZoom
      }
      if (payload.scale! < minZoom) {
        payload.scale = minZoom
      }
    }
    setRecoil(this._workspaceAtoms.transform, produceMerge(payload))
  }

  onUpdateWsConfig(_: CMD, { payload }: Params<Partial<WorkspaceConfig>>) {
    setRecoil(this._workspaceAtoms.config, config => {
      let newConfig = produceMerge(payload)(config)
      ls.set('workspace-config-ls-' + this._id, newConfig)
      return newConfig
    })
  }

  onCalculateGraphLayout(_: CMD, { payload }: Params<DagreConfig> = { payload: {} }) {

    let { nodes, edges } = this.getGraph()
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
    recoilTransaction(({ set }) => {
      set(this._graphAtoms.nodeFamily(payload), null)
      set(this._graphAtoms.nodeIdList, (draft: IDList) => draft = removeElementFromArray(draft, payload))
      if (getRecoil(this._workspaceAtoms.selectedElement)?.id === payload) {
        set(this._workspaceAtoms.selectedElement, null)
      }
    })
  }

  onUpsertNode(_: CMD, { payload }: Params<GraphNode>, setter?: RecoilSetter) {
    if (isUndefinedOrNull(payload.id)) {
      throw Error(`Invalid node ID: ${payload.id}`)
    }
    let exec = (setter: RecoilSetter) => {
      setter(this._graphAtoms.nodeFamily(payload.id), produce(draft => {
        if (!draft) return payload
        Object.assign(draft, payload)
        if (isUndefinedOrNull(draft.x) || isUndefinedOrNull(draft.y)) {
          let { x, y } = this._getNodeInitPosition(draft.width, draft.height)
          draft.x = x
          draft.y = y
        }
      }))
      setter(this._graphAtoms.nodeIdList, produce((draft: IDList) => {
        if (draft.indexOf(payload.id) > -1) return
        draft.push(payload.id)
      }))
    }
    setter ? exec(setter) : recoilTransaction(({ set }) => exec(set))
  }

  onSelectNode(_: CMD, { payload }: Params<GraphNode>) {
    this.clearSelection()
    recoilTransaction(({ set }) => {
      set(this._workspaceAtoms.selectedElement, {
        id: payload.id,
        type: 'node',
      })
      set(this._graphAtoms.nodeFamily(payload.id), produceMerge({ selected: true }))
    })
  }

  onDeselectNode(_: CMD, { payload }: Params<GraphNode>) {
    recoilTransaction(({ set, get }) => {
      let selected = get(this._workspaceAtoms.selectedElement)
      if (selected?.id === payload.id) {
        set(this._workspaceAtoms.selectedElement, null)
        set(this._graphAtoms.nodeFamily(payload.id), produceMerge({ selected: false }))
      }
    })

  }

  onUpsertEdge(_: CMD, { payload }: Params<GraphEdge>, setter?: RecoilSetter) {
    if (!payload.id) {
      throw Error(`Invalid edge ID: ${payload.id}`)
    }
    let exec = (setter: RecoilSetter) => {
      setter(this._graphAtoms.edgeFamily(payload.id), produceMerge(payload))
      setter(this._graphAtoms.edgeIdList, produce((draft: IDList) => {
        if (draft.indexOf(payload.id) > -1) return
        draft.push(payload.id)
      }))
    }
    setter ? exec(setter) : recoilTransaction(({ set }) => exec(set))
  }

  onDeleteEdge(_: CMD, { payload }: Params<string>) {
    recoilTransaction(({ set }) => {
      set(this._graphAtoms.edgeFamily(payload), null)
      set(this._graphAtoms.edgeIdList, (draft: IDList) => removeElementFromArray(draft, payload))
      if (getRecoil(this._workspaceAtoms.selectedElement)?.id === payload) {
        set(this._workspaceAtoms.selectedElement, null)
      }
    })
  }

  onSelectEdge(_: CMD, { payload }: Params<GraphEdge>) {
    this.clearSelection()
    setRecoil(this._workspaceAtoms.selectedElement, {
      id: payload.id,
      type: 'edge',
    })
  }
  onDeselectEdge(_: CMD) {
    setRecoil(this._workspaceAtoms.selectedElement, null)
  }
  onUndo() {
    this.undo()
  }
  onRedo() {
    this.redo()
  }
  onMouseMove(_, { payload }) {
    setRecoil(this._workspaceAtoms.mousePos, payload)
  }
  onHoverElement(_, { payload }) {
    setRecoil(this._workspaceAtoms.hoverElement, payload)
  }
  onDragMode(_, { payload }) {
    setRecoil(this._workspaceAtoms.dragMode, payload)
  }

  clearSelection() {
    recoilTransaction(({ set, get }) => {
      let selected = get(this._workspaceAtoms.selectedElement)
      selected && set(
        selected.type === 'node'
          ? this._graphAtoms.nodeFamily(selected.id)
          : this._graphAtoms.edgeFamily(selected.id),
        produceMerge({ selected: false }),
      )
    })
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
  return new CommandCenterInternal(id) as CommandCenter
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
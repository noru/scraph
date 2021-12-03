import {
  getRecoil,
  setRecoil,
} from '@/utils/RecoilNexus'
import {
  atom,
  RecoilState,
  waitForAll,
} from 'recoil'
import { produce } from '@/utils/produce'
import {
  getGraphModelAtoms,
  GraphAtoms,
  GraphEdge,
  GraphNode,
} from '../Workspace/hooks/useGraphAtoms'
import {
  getWorkspaceAtoms,
  WorkspaceAtoms,
} from '../Workspace/store/config'

const UNDO_SIZE = 30
type Payload = any

export enum CMD {
  InitGraph = 'InitGraph',
  Clear = 'Clear',
  CanvasTransform = 'CanvasTransform',
  ZoomToFit = 'ZoomToFit',
  CreateNode = 'CreateNode',
  UpdateNode = 'UpdateNode',
  NodeDragEnd = 'NodeDragEnd',
  CreateEdge = 'CreateEdge',
  UpdateEdge = 'UpdateEdge',
  DeleteNode = 'DeleteNode',
  DeleteEdge = 'DeleteEdge',
  HoverElement = 'HoverElement',
  ClickNode = 'ClickNode',
  SelectNode = 'SelectNode',
  DeselectNode = 'DeselectNode',
  ClickEdge = 'ClickEdge',
  SelectEdge = 'SelectEdge',
  DeselectEdge = 'DeselectEdge',
  RecalculateGraphLayout = 'RecalculateGraphLayout',
  UpdateWorkspaceConfig = 'UpdateWorkspaceConfig',
  DragModeChange = 'DragModeChange',
  MouseMove = 'MouseMove',
  Undo = 'Undo',
  Redo = 'Redo',
}

const ReadonlyNotAllowed = new Set([
  CMD.CreateEdge,
  CMD.CreateNode,
  CMD.UpdateNode,
  CMD.UpdateEdge,
  CMD.DeleteEdge,
  CMD.DeleteNode,
  CMD.DragModeChange,
  CMD.Undo,
  CMD.Redo,
])

export type Params<T = Payload> = {
  payload: T
  isRedo?: boolean
  undo?: CmdHandler
  redo?: CmdHandler
}

type Command = { cmd: CMD, params?: Params }

export type CmdHandler = (this: CommandCenter, cmd: CMD, params?: Params) => void
type Subscribers = {
  [cmd in CMD]: CmdHandler[]
}
export abstract class CommandCenter {

  _id: string
  _graphAtoms: GraphAtoms
  _workspaceAtoms: WorkspaceAtoms
  _readonly = false

  undoStackAtom: RecoilState<Command[]>
  redoStackAtom: RecoilState<Command[]>

  _subscribers: Subscribers = Object.keys(CMD).reduce((prev, next) => {
    prev[next] = [] as CmdHandler[]
    return prev
  }, {}) as Subscribers

  constructor(id: string) {
    this._id = id
    this._graphAtoms = getGraphModelAtoms(id)
    this._workspaceAtoms = getWorkspaceAtoms(id)
    this.undoStackAtom = atom<Command[]>({
      key: 'undo-stack-' + id,
      default: [],
    })
    this.redoStackAtom = atom<Command[]>({
      key: 'redo-stack-' + id,
      default: [],
    })
  }

  devMode(devMode: boolean) {
    this.dispatch(CMD.UpdateWorkspaceConfig, { payload: { devMode } })
    console.warn(`[CommandCenter] Set dev mode ${devMode ? 'ON' : 'OFF'}`)
  }

  setReadonly(readonly: boolean) {
    this._readonly = readonly
  }

  subscribe(cmd: CMD, ...handlers: CmdHandler[]) {
    handlers.forEach(h => this._subscribers[cmd].push(h))
    return () => handlers.map(h => {
      return () => this.unsubscribe(cmd, h)
    }).forEach(f => f())
  }

  unsubscribe(cmd: CMD, ...handlers: CmdHandler[]) {
    let callbacks = this._subscribers[cmd]
    this._subscribers[cmd] = callbacks.filter(func => handlers.indexOf(func) === -1)
  }

  exec(cmd: CMD, params?: Params<unknown>) {
    if (this._readonly && !this.isCommandAllowed(cmd)) {
      return
    }
    console.debug(`[CommandCenter] CMD ${cmd} executing`, params)
    this._subscribers[cmd].forEach((cb) => {
      try {
        cb.call(this, cmd, params)
      } catch (e) {
        console.error(`[CommandCenter] CMD ${cmd} error in executing subscriber`, cb, e)
      }
    })
    if (params?.undo) {
      setRecoil(this.undoStackAtom, produce(d => {
        if (d.length === UNDO_SIZE) {
          d.unshift()
        }
        d.push({
          cmd,
          params,
        })
      }))
      !params.isRedo && setRecoil(this.redoStackAtom, [])
    }
  }

  dispatch(cmd: CMD, params?: Params<unknown>, delay = 0) {
    setTimeout(() => this.exec(cmd, params), delay)
  }

  undo() {
    let undoStack = getRecoil(this.undoStackAtom)
    let action = undoStack[undoStack.length - 1]
    if (!action) {
      return
    }
    let { params, cmd } = action
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      params!.undo!.call(this, cmd, params)
      setRecoil(this.undoStackAtom, produce(d => d.pop()))
      setRecoil(this.redoStackAtom, produce(d => d.push(action as Command)))
    } catch (e) {
      console.error(`[CommandCenter] Undo CMD ${cmd} failed`)
      throw e
    }
  }

  redo() {
    let redoStack = getRecoil(this.redoStackAtom)
    let action = redoStack[redoStack.length - 1]
    if (!action) {
      return
    }
    let { params, cmd } = action
    if (params?.redo) {
      params.redo.call(this, cmd, params)
      setRecoil(this.redoStackAtom, produce(d => d.pop()))
      setRecoil(this.undoStackAtom, produce(d => d.push({
        cmd,
        params,
      })))
    } else {
      this.exec(cmd, {
        ...params!,
        isRedo: true,
      })
    }
  }

  getGraph() {
    let model = getRecoil(this._graphAtoms.graphIdList)
    let nodes = getRecoil(waitForAll(model.nodes.map(id => this._graphAtoms.nodeFamily(id)))) as GraphNode[]
    let edges = getRecoil(waitForAll(model.edges.map(id => this._graphAtoms.edgeFamily(id)))) as GraphEdge[]

    return {
      nodes,
      edges,
    }
  }

  getNodeById(id?: string) {
    if (!id) {
      return null
    }
    return getRecoil(this._graphAtoms.nodeFamily(id))
  }

  getWorkspaceConfig() {
    return getRecoil(this._workspaceAtoms.config)
  }

  getWorkspaceInfo() {
    return getRecoil(this._workspaceAtoms.info)
  }

  getWorkspaceCenter() {
    let { workspaceWidth = 0, workspaceHeight = 0 } = getRecoil(this._workspaceAtoms.config)
    let {
      scale, translateX, translateY,
    } = getRecoil(this._workspaceAtoms.transform)
    return {
      x: (workspaceWidth / 2 - translateX) / scale,
      y: (workspaceHeight / 2 - translateY) / scale,
    }
  }

  isCommandAllowed(cmd: CMD) {
    if (this._readonly && ReadonlyNotAllowed.has(cmd)) {
      return false
    }
    return true
  }
}

import { getWorkspaceStore, WorkspaceStore } from '@/Workspace/store/workspace'
import { observable } from 'mobx'
import { CMD } from './Commands'

const UNDO_SIZE = 30
type Payload = any

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

export type CmdHandler = (this: CommandCenterPublic, cmd: CMD, params?: Params) => void
type Subscribers = {
  [cmd in CMD]: CmdHandler[]
}
export abstract class CommandCenterPublic {

  _id: string
  _readonly = false
  _store: WorkspaceStore

  undoStack: Command[]
  redoStack: Command[]

  _subscribers: Subscribers = Object.keys(CMD).reduce((prev, next) => {
    prev[next] = [] as CmdHandler[]
    return prev
  }, {}) as Subscribers

  constructor(id: string) {
    this._id = id
    this._store = getWorkspaceStore(id)
    this.undoStack = observable([])
    this.redoStack = observable([])
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
      if (this.undoStack.length === UNDO_SIZE) {
        this.undoStack.unshift()
      }
      this.undoStack.push({
        cmd,
        params,
      })
      !params.isRedo && (this.redoStack.length = 0)
    }
  }

  dispatch(cmd: CMD, params?: Params<unknown>, delay = 0) {
    setTimeout(() => this.exec(cmd, params), delay)
  }

  undo() {
    let action = this.undoStack[this.undoStack.length - 1]
    if (!action) {
      return
    }
    let { params, cmd } = action
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      params!.undo!.call(this, cmd, params)
      this.undoStack.pop()
      this.redoStack.push(action)
    } catch (e) {
      console.error(`[CommandCenter] Undo CMD ${cmd} failed`)
      throw e
    }
  }

  redo() {
    let action = this.redoStack[this.redoStack.length - 1]
    if (!action) {
      return
    }
    let { params, cmd } = action
    if (params?.redo) {
      params.redo.call(this, cmd, params)
      this.redoStack.pop()
      this.redoStack.push({
        cmd,
        params,
      })
    } else {
      this.exec(cmd, {
        ...params!,
        isRedo: true,
      })
    }
  }

  getNodeById(id?: string) {
    if (!id) {
      return null
    }
    return this._store.graph.nodeMap[id]
  }

  getWorkspaceConfig() {
    return this._store.config
  }

  getWorkspaceInfo() {
    return this._store.state
  }

  getWorkspaceCenter() {
    let { workspaceWidth = 0, workspaceHeight = 0 } = this._store.config
    let {
      scale, translateX, translateY,
    } = this._store.state
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

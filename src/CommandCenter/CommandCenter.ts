import { memoize } from 'lodash'
import { useContext } from 'react'
import { WorkspaceIDContext } from '../Workspace/Workspace'
import { CommandCenterPrivate } from './CommandCenterPrivate'
import { CMD, ReadonlyNotAllowed } from './Commands'
import { CmdHandler, Params } from './types'
import { defaultLogger as log } from '@/utils/logger'

const UNDO_SIZE = 30

class CommandCenter extends CommandCenterPrivate {

  id: string

  constructor(id: string) {
    super(id)
    this.id = id
    window[`__workspace_cmd_${id.replace(/[^a-zA-Z0-9]/g, '')}`] = this
  }

  devMode(devMode: boolean) {
    this.dispatch(CMD.UpdateWorkspaceConfig, { payload: { devMode } })
    log.w(`[CommandCenter] Set dev mode ${devMode ? 'ON' : 'OFF'}`)
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
    if (cmd !== CMD.MouseMove) log.d(`[CommandCenter] CMD ${cmd} executing`, params)
    this._subscribers[cmd].forEach((cb) => {
      try {
        cb.call(this, cmd, params)
      } catch (e) {
        log.e(`[CommandCenter] CMD ${cmd} error in executing subscriber`, cb, e)
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
      log.e(`[CommandCenter] Undo CMD ${cmd} failed`)
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

  getEdgeById(id?: string) {
    if (!id) {
      return null
    }
    return this._store.graph.edgeMap[id]
  }

  selectElement(id: string) {
    let payload = { id }
    let element = this.getNodeById(id)
    if (element) {
      return this.dispatch(CMD.SelectNode, { payload })
    }
    element = this.getEdgeById(id)
    if (element) {
      return this.dispatch(CMD.SelectEdge, { payload })
    }
  }

  getWorkspaceConfig() {
    return this._store.config
  }

  getWorkspaceInfo() {
    return this._store.state
  }

  isCommandAllowed(cmd: CMD) {
    if (this._readonly && ReadonlyNotAllowed.has(cmd)) {
      return false
    }
    return true
  }

  destroy() {
    window[`__workspace_cmd_${this.id.replace(/[^a-zA-Z0-9]/g, '')}`] = null
  }

  clearSelection() {
    this._store.state.selectedElement = []
  }
}

const getCommandCenter = memoize((id: string) => {
  return new CommandCenter(id) as CommandCenter
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
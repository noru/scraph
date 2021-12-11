import { CommandCenter } from './CommandCenter'
import { CMD } from './Commands'

export type Command = { cmd: CMD, params?: Params }
export type CmdHandler = (this: CommandCenter, cmd: CMD, params?: Params) => void
export type Subscribers = {
  [cmd in CMD]: CmdHandler[]
}
export type Params<T = any> = {
  payload: T
  isRedo?: boolean
  undo?: CmdHandler
  redo?: CmdHandler
}
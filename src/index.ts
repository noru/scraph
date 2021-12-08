import { configure } from 'mobx'
configure({
  enforceActions: 'never',
})
export * from './Workspace'
export * from './CommandCenter'
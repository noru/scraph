import { configure } from 'mobx'
configure({
  enforceActions: 'never',
  isolateGlobalState: true,
})
export * from './Workspace'
export * from './CommandCenter'
export { deepSearchObject } from './utils/deepSearchObject'

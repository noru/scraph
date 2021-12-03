import React, { useContext } from 'react'
import JSONTree from 'react-json-tree'
import {
  useRecoilValue,
  waitForAll,
} from 'recoil'
import { useCommandCenter } from '../../CommandCenter'
import { useGraphAtoms } from '../hooks/useGraphAtoms'
import { WorkspaceIDContext } from '../Workspace'
import { useWorkspaceAtoms } from './WorkspaceRoot'

export function DebugPanel() {
  let { id } = useContext(WorkspaceIDContext)
  let {
    info, config, mousePos,
  } = useWorkspaceAtoms()
  let {
    graphIdList, nodeFamily, edgeFamily,
  } = useGraphAtoms()
  let { undoStackAtom, redoStackAtom } = useCommandCenter()
  let wsInfo = useRecoilValue(info)
  let wsConfig = useRecoilValue(config)
  let wsMousePos = useRecoilValue(mousePos)
  let undoStack = useRecoilValue(undoStackAtom)
  let redoStack = useRecoilValue(redoStackAtom)
  let graph = useRecoilValue(graphIdList)
  let nodes = useRecoilValue(waitForAll(graph.nodes.map(id => nodeFamily(id))))
  let edges = useRecoilValue(waitForAll(graph.edges.map(id => edgeFamily(id))))

  return (
    <JSONTree
      data={{
        id: id,
        WorkspaceConfig: wsConfig,
        WorkspaceInfo: wsInfo,
        undoStack,
        redoStack,
        MousePos: wsMousePos,
        graph,
        nodes,
        edges,
      }}
      hideRoot
      shouldExpandNode={([key], _, level) => {
        if (key === 'nodes' || key === 'edges' || key === 'undoStack' || key === 'redoStack' || level > 2) {
          return false
        }
        return true
      }}
    />
  )
}
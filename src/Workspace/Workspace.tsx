import React, {
  useEffect,
  useRef,
} from 'react'
import classes from '@/style.module.scss'
import { Background } from './components/Background'
import {
  Edges,
  Nodes,
} from './components/graph'
import { WorkspaceRoot } from './components/WorkspaceRoot'
import { Defs } from './components/defs/Defs'
import { CommandCenter, useCommandCenter } from '../CommandCenter'
import { ConnectingEdgeStore, GraphNode } from './store/graph'
import { setupD3 } from './setupD3'
import { useWorkspaceId } from '.'
import { EdgeInternal } from './components/graph/Edge'
import { useObservable } from 'use-mobx-observable'

interface WorkspaceContext {
  id: string
}
export const WorkspaceIDContext = React.createContext<WorkspaceContext>({ id: '' })

interface WorkspaceCallbacks {
  renderNode?: (node: GraphNode) => React.ReactNode
}

interface Props extends Partial<WorkspaceCallbacks> {
  id?: string
  readonly: boolean
  onInit?: (cmd: CommandCenter) => void
  width?: string | number
  height?: string | number
}

export const Workspace = ({
  id,
  renderNode,
  onInit,
  readonly = false,
  width = '100%',
  height = '100%',
}: Props) => {

  let idFromCtx = useWorkspaceId()
  let wsId = id || idFromCtx
  if (!wsId) {
    throw Error('[scraph] ID is needed. Either pass it by props or use WorkspaceIDContext to provide one')
  }

  let svgRef = useRef<SVGSVGElement>(null)
  let cmd = useCommandCenter(id)

  useEffect(() => {
    cmd.setReadonly(readonly)
  }, [readonly])
  useEffect(() => {
    onInit && onInit(cmd)
    return setupD3(wsId, svgRef.current!, cmd)
  }, [wsId])
  return (
    <WorkspaceIDContext.Provider value={{ id: wsId }}>
      <WorkspaceRoot
        width={width}
        height={height}
      >
        <svg
          className={classes['scraph-canvas']}
          ref={svgRef}
        >
          <Defs />
          <g>
            <Background />
            <g id="graph-entity">
              <Edges />
              <Nodes renderNode={renderNode} />
              <ConnectingEdge />
            </g>
          </g>
        </svg>
      </WorkspaceRoot>
    </WorkspaceIDContext.Provider>
  )
}

function ConnectingEdge() {
  useObservable(ConnectingEdgeStore)
  if (!ConnectingEdgeStore.exists) {
    return null
  }
  return (
    <EdgeInternal 
      id="connecting-edge"
      start={ConnectingEdgeStore.start!}
      end={ConnectingEdgeStore.end!}
      hoverable={false}
      pathStyles={{ pointerEvents: 'none' }}
    />
  )
}
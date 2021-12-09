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
import { useCommandCenter } from '../CommandCenter'
import { GraphNode } from './store/graph'
import { setupD3 } from './setupD3'
import { CommandCenterPublic } from '@/CommandCenter/CommandCenterPublic'
import { useWorkspaceId } from '.'

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
  onInit?: (cmd: CommandCenterPublic) => void
  width?: string | number
  height?: string | number
}

export const Workspace = ({
  id = useWorkspaceId(),
  renderNode,
  onInit,
  readonly = false,
  width = '100%',
  height = '100%',
}: Props) => {

  if (!id) {
    throw Error('[scraph] ID is needed. Either pass it by props or use WorkspaceIDContext to provide one')
  }

  let svgRef = useRef<SVGSVGElement>(null)
  let cmd = useCommandCenter(id)

  useEffect(() => {
    cmd.setReadonly(readonly)
  }, [readonly])
  useEffect(() => {
    onInit && onInit(cmd)
    return setupD3(id, svgRef.current!, cmd)
  }, [id])
  return (
    <WorkspaceIDContext.Provider value={{ id }}>
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
            </g>
          </g>
        </svg>
      </WorkspaceRoot>
    </WorkspaceIDContext.Provider>
  )
}

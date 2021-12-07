import React, {
  useEffect,
  useMemo,
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
import { getCommandCenter } from '../CommandCenter'
import { GraphNode } from './store/graph'
import { setupD3 } from './setupD3'

interface WorkspaceContext {
  id: string
}
export const WorkspaceIDContext = React.createContext<WorkspaceContext>({ id: 'default' })

interface WorkspaceCallbacks {
  renderNode?: (node: GraphNode) => React.ReactNode
}

interface Props extends Partial<WorkspaceCallbacks> {
  id: string
  readonly: boolean
  width?: string | number
  height?: string | number
}

export const Workspace = ({
  id,
  renderNode,
  readonly = false,
  width = '100%',
  height = '100%',
}: Props) => {
  let svgRef = useRef<SVGSVGElement>(null)
  let cmd = useMemo(() => getCommandCenter(id), [id])

  useEffect(() => {
    cmd.setReadonly(readonly)
  }, [readonly])
  useEffect(() => {
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

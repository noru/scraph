import React, {
  useEffect,
  useMemo,
  useRef,
} from 'react'
import classes from '@/style.module.scss'
import { Background } from './components/Background'
import {
  Edge,
  Node,
} from './components/graph'
import {
  GraphEdge,
  GraphNode,
  useGraphAtoms,
} from './hooks/useGraphAtoms'
import { Setup } from './Setup'
import { WorkspaceRoot } from './components/WorkspaceRoot'
import { Defs } from './components/defs/Defs'
import { CMD } from '../CommandCenter/CommandCenterBase'
import { getCommandCenter } from '../CommandCenter'
import { RecoilRoot, useRecoilValue } from 'recoil'
import RecoilNexus from '@/utils/RecoilNexus'

interface WorkspaceContext {
  id: string
}
export const WorkspaceIDContext = React.createContext<WorkspaceContext>({ id: 'default' })

interface WorkspaceCallbacks {
  renderNode?: (node: GraphNode) => React.ReactNode
}

interface GraphProps {
  initNodes: GraphNode[]
  initEdges: GraphEdge[]
}

interface Props extends Partial<WorkspaceCallbacks>, Partial<GraphProps> {
  id: string
  readonly: boolean
  width?: string | number
  height?: string | number
}

const WorkspaceInternal = ({
  id,
  renderNode,
  readonly = false,
  width = '100%',
  height = '100%',
  initNodes = [],
  initEdges = [],
}: Props) => {
  let svgRef = useRef<SVGSVGElement>(null)
  let { graphIdList } = useGraphAtoms(id)
  let { edges, nodes } = useRecoilValue(graphIdList)
  let renderedNodes = useMemo(() => {
    return nodes.map(id => (
      <Node
        key={id}
        id={id}
        renderNode={renderNode}
      />
    ))
  }, [nodes])

  let renderedEdges = useMemo(() => {
    return edges.map(id => (
      <Edge
        key={id}
        id={id}
      />
    ))
  }, [edges])

  let cmd = useMemo(() => getCommandCenter(id), [id])

  useEffect(() => {
    let payload = {
      nodes: initNodes,
      edges: initEdges,
    }
    cmd.dispatch(CMD.InitGraph, { payload })
  }, [id])

  useEffect(() => {
    cmd.setReadonly(readonly)
  }, [readonly])

  return (
    <WorkspaceIDContext.Provider value={{ id }}>
      <Setup svg={svgRef} />
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
              { renderedEdges }
              { renderedNodes }
            </g>
          </g>
        </svg>
      </WorkspaceRoot>
    </WorkspaceIDContext.Provider>
  )
}

export const Workspace = (props: Props) => {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <WorkspaceInternal {...props} />
    </RecoilRoot>
  )
}

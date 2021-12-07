import React from 'react'
import { useGraphState } from '@/Workspace/store'
import { GraphNode } from '@/Workspace/store/graph'
import { ReactNode } from 'react'
import { Node } from './Node'

interface Props {
  renderNode?: (node: GraphNode) => ReactNode
}

export function Nodes({ renderNode }: Props) {
  let { nodes } = useGraphState()
  return (
    <>
      {
        nodes.map(n => (
          <Node
            key={n.id}
            id={n.id}
            renderNode={renderNode}
          />
        ))
      }
    </>
  )
}
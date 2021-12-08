import React from 'react'
import { useNodeIdSet } from '@/Workspace/store'
import { GraphNode } from '@/Workspace/store/graph'
import { ReactNode } from 'react'
import { Node } from './Node'

interface Props {
  renderNode?: (node: GraphNode) => ReactNode
}

export function Nodes({ renderNode }: Props) {
  let idSet = useNodeIdSet()
  return (
    <>
      {
        Array.from(idSet).map(id => (
          <Node
            key={id}
            id={id}
            renderNode={renderNode}
          />
        ))
      }
    </>
  )
}
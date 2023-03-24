import React from 'react'
import { useWatchGraphState } from '@/Workspace/store'
import { GraphNode } from '@/Workspace/store/graph'
import { ReactNode } from 'react'
import { Node } from './Node'

interface Props {
  renderNode?: (node: GraphNode) => ReactNode
}

export function Nodes({ renderNode }: Props) {

  let [keys] = useWatchGraphState((store) => Array.from(store.nodes.keys()))
  return (
    <>
      {
        keys.map(id => (
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
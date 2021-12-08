import React from 'react'
import { useEdgeIdSet } from '@/Workspace/store'
import { Edge } from './Edge'

export function Edges() {
  let idSet = useEdgeIdSet()

  return (
    <>
      {
        Array.from(idSet).map(id => (
          <Edge
            key={id}
            id={id}
          />
        ))
      }
    </>
  )
}
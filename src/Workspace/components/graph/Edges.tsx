import React from 'react'
import { useGraphState } from '@/Workspace/store'
import { Edge } from './Edge'

export function Edges() {
  let { edges } = useGraphState()

  return (
    <>
      {
        edges.map(e => (
          <Edge
            key={e.id}
            id={e.id}
          />
        ))
      }
    </>
  )
}
import React from 'react'
import { useWatchGraphState } from '@/Workspace/store'
import { Edge } from './Edge'

export function Edges() {
  let [keys] = useWatchGraphState((store) => Array.from(store.edges.keys()))

  return (
    <>
      {
        keys.map(id => (
          <Edge
            key={id}
            id={id}
          />
        ))
      }
    </>
  )
}
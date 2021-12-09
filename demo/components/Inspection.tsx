import React from 'react'
import { useMousePositionState, useWorkspaceId } from '@/index'

export function Inspection() {

  let id = useWorkspaceId()

  let mousePos  = useMousePositionState()

  return (
    <div className="inspection">
      <div>ID: {id}</div>
      <span>Mouse: { JSON.stringify(mousePos) }</span>
    </div>
  )
}


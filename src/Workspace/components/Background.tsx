import React, { useContext } from 'react'
import { useWatchWorkspaceConfig } from '../store'
import { WorkspaceIDContext } from '../Workspace'

export function Background() {

  let { id } = useContext(WorkspaceIDContext)
  let [{ canvasSize , backgroundGrid }] = useWatchWorkspaceConfig(({ canvasSize , backgroundGrid }) => ({
    canvasSize ,
    backgroundGrid,
  }), id)

  let center = canvasSize / 2
  let x = -center + 2650
  let y = -center + 1440
  return (
    <>
      <rect
        fill="white"
        x={x}
        y={y}
        width={canvasSize}
        height={canvasSize}
      />
      <rect
        fill={`url(#grid-${backgroundGrid})`}
        x={x}
        y={y}
        width={canvasSize}
        height={canvasSize}
      />
    </>
  )
}
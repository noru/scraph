import React from 'react'
import { useRecoilValue } from 'recoil'
import { useWorkspaceAtoms } from './WorkspaceRoot'

export function Background() {

  let { config } = useWorkspaceAtoms()
  let { canvasSize , backgroundGrid } = useRecoilValue(config)
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
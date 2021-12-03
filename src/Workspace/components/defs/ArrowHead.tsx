import React from 'react'

const ArrowSize = 16

interface Props {
  id: string
  color?: string
}

export function ArrowheadMarker({ id, color }: Props) {

  return (
    <marker
      id={id}
      viewBox={`0 -${ArrowSize / 2} ${ArrowSize} ${ArrowSize}`}
      refX={`${ArrowSize - 3}`}
      markerWidth={`${ArrowSize}`}
      markerHeight={`${ArrowSize}`}
      orient="auto"
      markerUnits="userSpaceOnUse"
    >
      <path
        d={`M0,-${ArrowSize / 2}L${ArrowSize},0L0,${ArrowSize / 2}`}
        width={`${ArrowSize}`}
        height={`${ArrowSize}`}
        style={{ fill: color || '#666' }}
      />
    </marker>
  )
}
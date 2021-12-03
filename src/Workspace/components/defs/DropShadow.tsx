import React from 'react'

interface DropShadowProps {
  id: string
  dx?: number
  dy?: number
  stdDeviation?: number
  floorColor?:string
  floodOpacity?:number
}

export function DropShadow({
  id,
  dx = 0,
  dy = 0,
  stdDeviation = 4,
  floorColor,
  floodOpacity = 1,
}: DropShadowProps) {
  return (
    <filter id={id}>
      <feDropShadow
        dx={dx}
        dy={dy}
        stdDeviation={stdDeviation}
        floodColor={floorColor}
        floodOpacity={floodOpacity}
      />
    </filter>
  )
}

import React from 'react'

export function Checker() {
  return (
    <pattern
      id="grid-checker"
      x="0"
      y="0"
      width="200"
      height="200"
      patternUnits="userSpaceOnUse"
    >
      <rect
        className="checker"
        x="0"
        y="0"
        width="100"
        height="100"
        fill='#efefef'
      />
      <rect
        className="checker"
        x="100"
        y="100"
        width="100"
        height="100"
        fill='#efefef'
      />
    </pattern>
  )
}
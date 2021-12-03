import React from 'react'

export function Dot() {
  return (
    <pattern
      id="grid-dot"
      width="50"
      height="50"
      patternUnits="userSpaceOnUse"
    >
      <circle
        className="circle"
        cx="0"
        cy="0"
        r="1.8"
        fill="#ddd"
      />
      <circle
        className="circle"
        cx="50"
        cy="0"
        r="1.8"
        fill="#ddd"
      />
      <circle
        className="circle"
        cx="50"
        cy="50"
        r="1.8"
        fill="#ddd"
      />
      <circle
        className="circle"
        cx="0"
        cy="50"
        r="1.8"
        fill="#ddd"
      />
    </pattern>
  )
}
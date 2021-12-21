import React from 'react'
import { capitalize } from 'lodash'

// eslint-disable-next-line max-len
const FontFamily = '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, \'Noto Sans\', sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\', \'Noto Color Emoji\''
const BreakPoint = 25
interface Props {
  type: string
  text: string
}

function getColor(type) {
  switch (type) {
  case 'scala':
    return '#558ed2'
  case 'sql':
    return '#558ed2'
  default:
    return '#558ed2'
  }
}

export function CustomNode({
  type = '',
  text = '',
}: Props) {
  let labelColor = 'white'
  let textColor = '#333'
  let color = getColor(type)
  let doubleLine: [string, string] | null = null
  if (text.length > BreakPoint) {
    doubleLine = [text.substring(0, BreakPoint), text.substring(BreakPoint)]
  }
  return (
    <svg
      width="256"
      height="93"
      viewBox="0 0 256 93"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="254"
        height="91"
        rx="5"
        fill="white"
      />
      <path
        d="M2 6C2 3.79086 3.79086 2 6 2H250C252.209 2 254 3.79086 254 6V26H2V6Z"
        fill={color}
      />
      <rect
        x="1"
        y="1"
        width="254"
        height="91"
        rx="5"
        stroke={color}
        strokeWidth="2"
      />
      <text
        width="250"
        height="24"
        fontFamily={FontFamily}
        fontSize="18"
        fontStyle="normal"
        fontWeight="400"
        text-align="left"
        textAnchor="start"
        fill={labelColor}
        x="0"
        y="0"
      >
        <tspan
          x="8"
          y="1"
          dy="19"
        >
          { capitalize(type) }
        </tspan>
        {
          doubleLine ? (
            <>
              <tspan
                x="12"
                y="1"
                dy="50"
                fontSize="16"
                fill={textColor}
              >
                { doubleLine[0] }
              </tspan>
              <tspan
                x="12"
                y="1"
                dy="74"
                fill={textColor}
                fontSize="16"
              >
                { doubleLine[1] }
              </tspan>
            </>
          ) :
            <tspan
              x="12"
              y="1"
              dy="62"
              fontSize="16"
              fill={textColor}
            >
              { text }
            </tspan>
        }
      </text>
    </svg>
  )
}

import { RefObject } from 'react'
import { useD3 } from './hooks'

interface Props {
  svg: RefObject<SVGElement | undefined>
}

export function Setup({ svg }: Props) {
  useD3(svg)
  return null
}

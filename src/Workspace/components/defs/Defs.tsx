import React from 'react'
import { ArrowheadMarker } from './ArrowHead'
import { DropShadow } from './DropShadow'
import { Checker } from './patterns/Checker'
import { Dot } from './patterns/Dot'


export function Defs() {
  return (
    <defs>
      <DropShadow
        id="shadow1"
        dx={2}
        dy={2}
      />
      <DropShadow
        id="shadow2"
        dx={3}
        dy={3}
        stdDeviation={0}
        floorColor="#558ED2"
      />
      <Checker />
      <Dot />
      <ArrowheadMarker id="arrow-head" />
      <ArrowheadMarker
        id="arrow-head-hover"
        color="#558ED2"
      />
      <ArrowheadMarker
        id="arrow-head-selected"
        color="#a0df70"
      />
    </defs>
  )
}

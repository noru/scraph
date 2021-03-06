import * as d3 from 'd3'
import isNumber from 'lodash.isnumber'
import {
  CMD,
  CmdHandler,
  CommandCenter,
} from '@/CommandCenter'

export function setupD3(id: string, svg: SVGElement, cmd: CommandCenter) {

  let root = d3.select(svg)
  let canvas = root.select('g')
  let onZoom = (evt) => {
    const transform = evt.transform
    let payload = {
      scale: transform.k,
      translateX: transform.x,
      translateY: transform.y,
      fromD3: true,
    }
    cmd.dispatch(CMD.CanvasTransform, { payload })
  }

  let zoom = d3.zoom()
    .scaleExtent([cmd._store.config.minZoom || 0, cmd._store.config.maxZoom || 0])
    .on('zoom', onZoom)
  let syncFunc: CmdHandler = (_, params) => {
    if (!params) {
      return
    }
    let {
      payload: {
        translateX: x, translateY: y, scale: k, fromD3,
      },
    } = params
    let {
      scale, translateX, translateY,
    } = cmd.getWorkspaceInfo()
    let newX = isNumber(x) ? x : translateX
    let newY = isNumber(y) ? y : translateY
    let newScale = k || scale
    if (fromD3) {
      canvas.attr('transform', `translate(${newX}, ${newY}) scale(${newScale})`)
    } else {
      let transform = d3.zoomIdentity.translate(newX, newY).scale(newScale)
      zoom.transform(root, transform)
    }
  }
  let centerNode = (node) => {
    if (node?.children.length === 0 || !node?.getBBox) {
      return
    }
    let viewBBox = node.getBBox()
    let wsConfig = cmd.getWorkspaceConfig()
    const width = wsConfig.workspaceWidth ?? 1024
    const height = wsConfig.workspaceHeight ?? 768
    const minZoom = wsConfig.minZoom || 0
    const maxZoom = wsConfig.maxZoom || 2
    const next = {
      k: (minZoom + maxZoom) / 2,
      x: 0,
      y: 0,
    }
    if (viewBBox.width > 0 || viewBBox.height > 0) {
      const dx = viewBBox.width
      const dy = viewBBox.height
      const x = viewBBox.x + dx / 2
      const y = viewBBox.y + dy / 2
      next.k = 0.9 / Math.max(dx / width, dy / height)
      if (next.k < minZoom) {
        next.k = minZoom
      } else if (next.k > maxZoom) {
        next.k = maxZoom
      }
      next.x = width / 2 - next.k * x
      next.y = height / 2 - next.k * y
    }
    const t = d3.zoomIdentity.translate(next.x, next.y).scale(next.k)
    root
      .transition()
      .duration(500)
      .call(zoom.transform, t)
  }
  let zoomToFit = () => {
    let entities = canvas.select('#graph-entity').node()
    centerNode(entities)
  }
  let centerElement: CmdHandler = (_, params) => {
    let element = canvas.select(`#_${params?.payload?.id}`).node()
    centerNode(element)
  }
  cmd.subscribe(CMD.CenterElement, centerElement)
  cmd.subscribe(CMD.CanvasTransform, syncFunc)
  cmd.subscribe(CMD.ZoomToFit, zoomToFit)
  root.call(zoom)

  return () => {
    cmd.subscribe(CMD.CenterElement, centerElement)
    cmd.unsubscribe(CMD.CanvasTransform, syncFunc)
    cmd.unsubscribe(CMD.ZoomToFit, zoomToFit)
  }
}

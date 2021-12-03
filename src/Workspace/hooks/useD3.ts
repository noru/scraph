import * as d3 from 'd3'
import isNumber from 'lodash.isnumber'
import {
  RefObject,
  useContext,
  useEffect,
} from 'react'
import {
  atomFamily,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
import { WorkspaceIDContext } from '../Workspace'
import { useCommandCenter } from '../../CommandCenter'
import {
  CMD,
  CmdHandler,
} from '../../CommandCenter/CommandCenterBase'
import { useWorkspaceAtoms } from '../components/WorkspaceRoot'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D3Element = any

interface D3Atom {
  svg: D3Element,
  canvas: D3Element,
  zoom: D3Element,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const D3Instances = atomFamily<D3Atom, string>({
  key: 'd3-atom',
  default: {
    svg: null,
    canvas: null,
    zoom: null,
  },
})

export const D3 = selectorFamily({
  key: 'd3-with-actions',
  get: (id: string) => ({ get }) => {
    let instances = get(D3Instances(id))
    return {
      ...instances,
    }
  },
})

export function useD3(svg: RefObject<SVGElement | undefined>) {
  let { id } = useContext(WorkspaceIDContext)
  let { config } = useWorkspaceAtoms()
  let { minZoom, maxZoom } = useRecoilValue(config)
  let setD3State = useSetRecoilState(D3Instances(id))
  let cmd = useCommandCenter()

  useEffect(() => {
    let root = d3.select(svg.current)
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
      .scaleExtent([minZoom || 0, maxZoom || 0])
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
    let zoomToFit = () => {
      let entities = canvas.select('#graph-entity').node()
      if (entities && entities.children.length > 0 && entities.getBBox) {
        let viewBBox = entities.getBBox()
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
        if (viewBBox.width > 0 && viewBBox.height > 0) {
          const dx = viewBBox.width
          const dy = viewBBox.height
          const x = viewBBox.x + viewBBox.width / 2
          const y = viewBBox.y + viewBBox.height / 2
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
    }
    cmd.subscribe(CMD.CanvasTransform, syncFunc)
    cmd.subscribe(CMD.ZoomToFit, zoomToFit)
    setD3State(state => {
      root.call(zoom)
      return {
        ...state,
        svg: root,
        canvas,
        zoom,
      }
    })
    return () => {
      cmd.unsubscribe(CMD.CanvasTransform, syncFunc)
      cmd.unsubscribe(CMD.ZoomToFit, zoomToFit)
    }
  }, [id])
  return useRecoilValue(D3(id))
}
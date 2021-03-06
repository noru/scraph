import React, {
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import classes from '@/style.module.scss'
import { WorkspaceIDContext } from '../Workspace'
import Drawer from 'rc-drawer'
import 'rc-drawer/assets/index.css'
import throttle from 'lodash.throttle'
import { useCommandCenter, CMD } from '@/CommandCenter'
import { Toolbar } from './Toolbar'
import { DebugPanel } from './DebugPanel'
import { useWatchWorkspaceConfig } from '../store'
import ErrorBoundary from './ErrorBoundary'

interface Props {
  width?: string | number
  height?: string | number
}

export const WorkspaceRoot = ({
  children, width, height,
}: PropsWithChildren<Props>) => {
  let ref = useRef<HTMLDivElement>(null)
  let { id } = useContext(WorkspaceIDContext)
  let [devMode] = useWatchWorkspaceConfig(s => s.devMode)
  let [showDebugDrawer, setDebugDrawer] = useState(false)
  let cmd = useCommandCenter()

  let onMouseMove = useCallback(throttle((evt: MouseEvent) => {
    let payload = {
      x: evt.clientX,
      y: evt.clientY,
    }
    cmd.dispatch(CMD.MouseMove, { payload })
  }, 10), [id])

  useEffect(() => {
    let workspaceResizing = () => {
      if (!ref.current) {
        return
      }
      let payload = {
        workspaceWidth: ref.current.offsetWidth | 1024,
        workspaceHeight: ref.current.offsetHeight | 768,
      }
      cmd.dispatch(CMD.UpdateWorkspaceConfig, { payload })
      cmd.dispatch(CMD.ZoomToFit)
    }
    window.addEventListener('resize', workspaceResizing)
    workspaceResizing()
    return () => window.removeEventListener('resize', workspaceResizing)
  }, [])

  return (
    <ErrorBoundary>
      <div
        ref={ref}
        className={classes['scraph-wrapper']}
        style={{
          width,
          height,
        }}
        onMouseMove={onMouseMove}
      >
        { children }
        { devMode &&
          <>
            <Toolbar />
            <Drawer
              placement="right"
              width="25vw"
              onHandleClick={() => setDebugDrawer(!showDebugDrawer)}
              open={showDebugDrawer}
              showMask={false}
              handler={<div className="drawer-handle">&#128030;</div>}
              getContainer={() => ref.current!}
            >
              { showDebugDrawer && <DebugPanel />}
            </Drawer>
          </>
        }
      </div>
    </ErrorBoundary>
  )
}
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
import { useRecoilValue } from 'recoil'
import { WorkspaceIDContext } from '../Workspace'
import Drawer from 'rc-drawer'
import 'rc-drawer/assets/index.css'
import throttle from 'lodash.throttle'
import { useCommandCenter } from '../../CommandCenter'
import { CMD } from '../../CommandCenter/CommandCenterBase'
import { Toolbar } from './Toolbar'
import { getWorkspaceAtoms } from '../store/config'
import { DebugPanel } from './DebugPanel'

interface Props {
  width?: string | number
  height?: string | number
}

// todo, does this make sense?
export function useWorkspaceAtoms() {
  let { id } = useContext(WorkspaceIDContext)
  return getWorkspaceAtoms(id)
}

export const WorkspaceRoot = ({
  children, width, height,
}: PropsWithChildren<Props>) => {
  let ref = useRef<HTMLDivElement>(null)
  let { id } = useContext(WorkspaceIDContext)
  let { config } = useWorkspaceAtoms()
  let wsConfig = useRecoilValue(config)
  let [showDebugDrawer, setDebugDrawer] = useState(false)
  let cmd = useCommandCenter()

  let onMouseMove = useCallback(throttle((evt: MouseEvent) => {
    let payload = {
      mouseX: evt.clientX,
      mouseY: evt.clientY,
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
      { wsConfig.devMode &&
      <>
        <Toolbar />
        <button
          style={{
            position: 'absolute',
            top: 15,
            right: 15,
          }}
          onClick={() => setDebugDrawer(!showDebugDrawer)}
        >
          &#128030;
        </button>
      </>
      }
      <Drawer
        placement="right"
        onHandleClick={() => setDebugDrawer(!showDebugDrawer)}
        open={showDebugDrawer}
        showMask={false}
        handler={<div className="drawer-handle">&#128030;</div>}
        // handler={true}
        width="20vw"
        // drawerStyle={{ backgroundColor: 'rgb(0, 43, 54)' }}
        // headerStyle={{ backgroundColor: 'rgb(0, 43, 54)' }}
        // bodyStyle={{ paddingTop: 0 }}
        // closeIcon={<span style={{ color: 'white' }}>X</span>}
        getContainer={() => ref.current!}
        // style={{ position: 'absolute' }}
      >
        { showDebugDrawer && <DebugPanel />}
      </Drawer>
    </div>
  )
}
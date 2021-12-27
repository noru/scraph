import React from 'react'
import { CMD, Workspace, WorkspaceIDContext } from '@/index'
import { graph } from './initGraph'
import Drawer from 'rc-drawer'
import { Inspection } from './components/Inspection'
import { CustomNode } from './components/CustomNode'

function Demo() {

  return (
    <div className="App">
      <WorkspaceIDContext.Provider value={{ id: 'scraph-demo' }}>
        <div className="workspace-wrapper">
          <Workspace
            id="scraph-demo"
            readonly={false}
            onInit={(cmd) => {
              cmd.dispatch(CMD.InitGraph, { payload: graph })
            }}
            renderNode={(n) => <CustomNode text={n.id} type='type'/>}
          />
          <Drawer
            placement="left"
            showMask={false}
            width="25vw"
          >
            <Inspection />
          </Drawer>
        </div>
      </WorkspaceIDContext.Provider>
    </div>
  )
}

export default Demo

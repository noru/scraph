import React from 'react'
import { CMD, useSelectedElements, Workspace, WorkspaceIDContext } from '@/index'
import { graph } from './initGraph'
import Drawer from 'rc-drawer'
import { Inspection } from './components/Inspection'
import { CustomNode } from './components/CustomNode'

const DemoWSId = 'scraph-demo'

function Demo() {

  let selectedElements = useSelectedElements(DemoWSId)

  return (
    <div className="App">
      <WorkspaceIDContext.Provider value={{ id: DemoWSId }}>
        <div className="workspace-wrapper">
          <Workspace
            id="scraph-demo"
            readonly={false}
            onInit={(cmd) => {
              cmd.dispatch(CMD.InitGraph, { payload: graph })
            }}
            renderNode={(n) => {
              let selected = !!selectedElements.find(i => i.id === n.id)
              return <CustomNode text={n.id} type='type' selected={selected}/>
            }}
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

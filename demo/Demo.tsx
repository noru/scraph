import React from 'react'
import { CMD, Workspace } from '@/index'
import { graph } from './initGraph'

function Demo() {

  return (
    <div className="App">
      <div className="workspace-wrapper">
        <Workspace
          id="scraph-demo"
          readonly={false}
          onInit={(cmd) => {
            cmd.dispatch(CMD.InitGraph, { payload: graph })
          }}
          // renderNode={renderNode}
        />
      </div>
    </div>
  )
}

export default Demo

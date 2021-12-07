import React from 'react'
import { Workspace } from '@/index'


function Demo() {

  return (
    <div className="App">
      <div className="workspace-wrapper">
        <Workspace
          id="scraph-demo"
          readonly={false}
          // renderNode={renderNode}
        />
      </div>
    </div>
  )
}

export default Demo

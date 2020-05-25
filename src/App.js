/* src/App.js */
import React, { useEffect, useState } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import Todos from './components/Todos'

const App = () => {

  return (
    <div>
      <Todos/>

    </div>
  )
}

export default withAuthenticator(App)

/* src/App.js */
import React, { useEffect, useState } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import Menubar from './components/Menubar'
import Home from './components/Home'
import Todos from './components/Todos'
import Upload from './components/Upload'
import Predict from './components/Predict'

import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

const Footer = () => {
  return (
      <footer class="fixed-bottom footer text-center text-muted bg-dark">
        © 2020 Amazon Web Services ASEAN. Dedicated to Devs!
      </footer>
  )
}

const App = () => {

  return (
    <div>
      <Menubar/>
      <Router>
        <Switch>
            <Route exact path="/" component={Home} />} />
            <Route exact path="/todos" component={Todos} />
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/predict" component={Predict} />
        </Switch>
      </Router>
      <Footer/>
    </div>
  )
}

export default withAuthenticator(App)

/* src/App.js */
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css'
import Container from 'react-bootstrap/Container';
import React from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import Menubar from './components/Menubar'
import Home from './components/Home'
import Todos from './components/Todos'
import Upload from './components/Upload'
import Predict from './components/Predict'
import RegisterPerson from './components/RegisterPerson'
import RecognizePerson from './components/RecognizePerson'
import DetectRiceDisease from './components/DetectRiceDisease'
import Fortune from './components/Fortune'

import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

const Footer = () => {
  return (
      <footer className="fixed-bottom footer text-center text-muted bg-dark">
        © 2020 Amazon Web Services ASEAN. Dedicated to Devs!
      </footer>
  )
}

const App = () => {

  return (
    <div>
      <Menubar/>
      <Container>
        <Router>
          <Switch>
              <Route exact path="/" component={Home} />} />
              <Route exact path="/todos" component={Todos} />
              <Route exact path="/upload" component={Upload} />
              <Route exact path="/predict" component={Predict} />
              <Route exact path="/registerperson" component={RegisterPerson} />
              <Route exact path="/recognizeperson" component={RecognizePerson} />
              <Route exact path="/detectricedisease" component={DetectRiceDisease} />
              <Route exact path="/fortune" component={Fortune} />
          </Switch>
        </Router>
      </Container>
      <Footer/>
    </div>
  )
}

export default withAuthenticator(App)

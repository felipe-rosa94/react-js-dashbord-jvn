import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './pages/Login'
import Devocionais from "./pages/Devocionais"
import Podcasts from './pages/Podcasts'
import Inscricoes from './pages/Inscricoes'

const App = () => {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
            <Route exact path="/devocionais" component={Devocionais} />
            <Route exact path="/podcasts" component={Podcasts} />
            <Route exact path="/inscricoes" component={Inscricoes} />
        </Switch>
      </BrowserRouter>
  )
}

export default App;
import React from 'react'
import { Routes ,Route} from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

export const serverUrl = 'http://localhost:8000'

const App = () => {
  return (
    <Routes>
      <Route path = '/signup' element = {<SignUp></SignUp>}></Route>
      <Route path = '/signin' element = {<SignIn></SignIn>}></Route>
    </Routes>
  )
}

export default App
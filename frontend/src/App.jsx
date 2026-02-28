import React from 'react'
import { Routes ,Route} from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'

export const serverUrl = 'http://localhost:8000'

const App = () => {
  return (
    <Routes>
      <Route path = '/signup' element = {<SignUp></SignUp>}></Route>
      <Route path = '/signin' element = {<SignIn></SignIn>}></Route>
      <Route path = '/forgot-password' element = {<ForgotPassword></ForgotPassword>}></Route>
    </Routes>
  )
}

export default App
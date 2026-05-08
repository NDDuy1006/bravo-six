import { BrowserRouter, Route, Routes } from 'react-router'
import {Toaster} from 'sonner'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ChatAppPage from './pages/ChatAppPage'

function App() {

  return (
    <>
      <Toaster richColors/>
      <BrowserRouter>
        <Routes>
          <Route
            path='/signin'
            element={<SignInPage/>}
          />
          <Route
            path='/signup'
            element={<SignUpPage/>}
          />
          <Route
            path='/'
            element={<ChatAppPage/>}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

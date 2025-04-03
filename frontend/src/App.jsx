import { useState } from 'react'

import './App.css'
import { UserProvider } from './context/user.context'
import AppRoutes from './Routes/AppRoutes'
function App() {

  return (
    <UserProvider>
    <AppRoutes/>   
    </UserProvider> 
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MyRouter from './myroute/MyRoute'
import QueryWrapper from '../providers/react-query/QueryWrapper'

function App() {
  return (
    <>
      <QueryWrapper>
        <MyRouter />
      </QueryWrapper>
    </>
  )
}

export default App

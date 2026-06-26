import { useState } from 'react'
import './App.css'
import { Global, css } from '@emotion/react'
import HomePage from './pages/HomePage'

function App() {

  return (
    <>
      <Global
        styles={css`
          * {
            font-family: 'IBM Plex Sans KR', 'IBM Plex Mono', sans-serif;
          }
        `}
      />
      <HomePage></HomePage>
    </>
  )
}

export default App

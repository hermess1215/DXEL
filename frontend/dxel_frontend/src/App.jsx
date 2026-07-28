import { useState } from 'react'
import './App.css'
import { Global, css } from '@emotion/react'
import HomePage from './pages/HomePage'
import MeetingDetailPage from './pages/MeetingDetailPage'
import { BrowserRouter, Routes, Route} from 'react-router-dom'

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
      <BrowserRouter>
          <Routes>
            <Route path='/' element={ <HomePage /> } />
            <Route path='/meetings/:id' element={ <MeetingDetailPage /> } />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

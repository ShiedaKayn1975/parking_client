import React from 'react'
import './index.css'
import AppProvider from './AppProvider'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import MetaTags from 'react-meta-tags';

const App = (props) => {

  return (
    <div>
      <MetaTags>
        <title>Parking car system</title>
        <meta name="description" content="Parking car system" />
        <meta property="og:title" content="Parking car system" />
      </MetaTags>
      <AppProvider
        {...props}
      />
      <ToastContainer
        theme='colored'
        position="bottom-right"
        autoClose={3000}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App
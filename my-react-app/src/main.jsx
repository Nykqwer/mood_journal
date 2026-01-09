import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './components/App'
import "@fontsource/source-sans-pro/400.css"; // regular
import "@fontsource/source-sans-pro/600.css"; // semi-bold
import logo from "./assets/logowhite.png"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <header>
      <div>
        <div className='left-content-head'>
        
              <img src={logo} alt="" />
              <h1>Damdamin</h1>
         
        </div>

      </div>
      </header>
      <main className='main'>
       
                 <App />
        
        </main> 
        <footer>
       
        </footer>

  </StrictMode>,
)

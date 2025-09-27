import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

import Signup from './components/Signup.tsx'
import Editor from './components/Editor.tsx'
import Login from './components/Login.tsx'
import { AlertProvider } from './components/Alert.tsx'
import List from './components/List.tsx'
const router = createBrowserRouter([

{
    path: "/",
    element: <App />,
    children:[
        {
          path: "/",
          element:<Login/>
        },
        {
          path: "/signup",
          element:<Signup/>
        },
        {
          path:'/dashboard',
          element:<List/>
        },
        {
          path:'/project/:id',
          element:<Editor/>
        }
    ]
  },

])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AlertProvider>
     <RouterProvider router={router}/>
     </AlertProvider>
  </StrictMode>,
)

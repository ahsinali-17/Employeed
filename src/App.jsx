import React,{ useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import LandingPage from './pages/Land'
import OnBoarding from './pages/onboarding'
import JobListing from './pages/job-listing'
import Job from './pages/job'
import PostJob from './pages/post-job'
import SavedJob from './pages/saved-job'
import MyJobs from './pages/my-jobs'
import { ThemeProvider } from './components/theme-provider'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  const router = createBrowserRouter([
    {
    element: <AppLayout/>,
    children:[
      {
        path: '/',
        element: <LandingPage/>
      },
      {
        path: '/onboarding',
        element: <ProtectedRoute><OnBoarding/></ProtectedRoute>
      },
      {
        path: '/jobs',
        element:<ProtectedRoute><JobListing/></ProtectedRoute> 
      },
      {
        path: '/job/:id',
        element: <ProtectedRoute><Job/></ProtectedRoute>
      },
      {
        path: '/post-job',
        element: <ProtectedRoute><PostJob/></ProtectedRoute>
      },
      {
        path: '/saved-jobs',
        element: <ProtectedRoute><SavedJob/></ProtectedRoute>
      },
      {
        path: '/my-jobs',
        element: <ProtectedRoute><MyJobs/></ProtectedRoute>
      },
    ]
  }
  ])
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}/>
      </ThemeProvider>
  )
}

export default App

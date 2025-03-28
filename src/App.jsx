import React,{ useState, lazy} from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
const LandingPage = lazy(() => import('./pages/Land'))
const OnBoarding = lazy(() => import('./pages/onboarding'))
const JobListing = lazy(() => import('./pages/job-listing'))
const Job = lazy(() => import('./pages/job'))
const PostJob = lazy(() => import('./pages/post-job'))
const SavedJob = lazy(() => import('./pages/saved-job'))
const MyJobs = lazy(() => import('./pages/my-jobs'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))
import { ThemeProvider } from './components/theme-provider'


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

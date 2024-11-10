import Header from '@/components/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'
const AppLayout = () => {
  return (
    <div >
        <div className='background-grid'></div>
        <main className='min-h-screen container max-w-screen-xl'>
          <Header/>
        <Outlet/>
        </main>
        <div className='px-10 py-2 text-center text-blue-200 bg-gray-800 mt-10'>A full-stack Job portal App</div>
    </div>
  )
}

export default AppLayout
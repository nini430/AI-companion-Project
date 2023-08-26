import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import checkSubscription from '@/lib/subscription'
import React from 'react'

const RootLayout = async ({children}:{children:React.ReactNode}) => {
  const isPro=await checkSubscription();
  return (
    <div className='h-full'>
      <Navbar isPro={isPro} />
      <div className='hidden fixed md:flex flex-col mt-16 w-20 h-full'>
        <Sidebar isPro={isPro} />
      </div>
        <main className='md:pl-20 pt-16 h-full'>
        {children}
        </main>
      
    </div>
  )
}

export default RootLayout
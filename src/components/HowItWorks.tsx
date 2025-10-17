import React from 'react'

const HowItWorks = () => {
  return (
   <section className='w-full bg-gray-50 py-16' id='how-it-works'>
 <div className='max-w-7xl mx-auto'>
    <div className='text-center mb-16'>
        <h2 className='text-5xl font-bold text-gray-900 mb-4'>
       How it Works     
        </h2>
        <p className='text-xl text-gray-600'>
       Get started in three simple steps     
        </p>
    </div>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-12 px-4'>
   <div className='text-center relative'>
   <div className='hidden md:block absolute top-16 left-1/2 w-full h-1 bg-gradient-to-r from-green-500 to-green-300'></div>
   <div className='relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-xl '>
 <span className='text-5xl font-bold text-white'>1</span>
   </div>
   <h3 className='font-bold text-2xl text-gray-900 mb-3'>
Create an Account
   </h3>
   <p>
Sign up in seconds to get started
   </p>
   </div>
    <div className='text-center relative'>
    <div className='hidden md:block absolute top-16 left-1/2 w-full h-1 bg-gradient-to-r from-green-500 to-green-300'></div>
    <div className='relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-xl '>
    <span className='text-5xl font-bold text-white'>2</span>
    </div>
     <h3 className='font-bold text-2xl text-gray-900 mb-3'>
Choose QR Type
   </h3>
   <p>
Select from 6 different QR types
   </p>
    </div>
      <div className='text-center relative'>
    
    <div className='relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-xl '>
    <span className='text-5xl font-bold text-white'>3</span>
    </div>
      <h3 className='font-bold text-2xl text-gray-900 mb-3'>
Generate Instantly
   </h3>
   <p>
Get your QR code immediately
   </p>
    </div>
    </div>
 </div>
   </section>
  )
}

export default HowItWorks

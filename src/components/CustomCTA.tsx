import React from 'react'

const CustomCTA = () => {
  return (
    <section className='w-full py-12 px-4 bg-white'>
    <div className='bg-black px-6 py-12 rounded-3xl max-w-4xl mx-auto text-center'>
       <h2 className='text-4xl font-bold text-white mb-4'>
        Need something custom?
       </h2>
       <p className='text-xl text-gray-300 mb-8'> 
        Let us create a tailored QR solution for your business
       </p>
       <button className='items-center text-white text-lg bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full mt-6 transition'>
        Apply for Custom QR
       </button>

    </div>
    </section>
  )
}

export default CustomCTA

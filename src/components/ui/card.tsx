import Link from 'next/link'
import React from 'react'

function Card() {
  return (
    <Link href="/books">
    <div className='h-[26vw] w-[18vw] mx-3 my-8 rounded-[1.5vw] overflow-hidden hover:shadow-xl hover:scale-105 bg-slate-200'>
        <img
        className='h-[20vw] w-full object-cover' 
        src="https://i.pinimg.com/474x/98/b7/77/98b7773682e9f31537d4ace42f4c7fef.jpg" alt="" />
        
        <div className='px-5 py-3 flex justify-between text-black font-["gilroy"]'>
        Book <br/> T.E. Comp
        <div>Rs. 159</div>
        </div>
        </div>
        </Link>
  )
}

export default Card
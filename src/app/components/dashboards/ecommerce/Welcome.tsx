'use client';
import React from 'react'
import CardBox from '../../shared/CardBox';
import Image from 'next/image';
import Backgrond from '/public/images/backgrounds/make-social-media.png';


const Welcome = () => {
  return (
    <CardBox className='bg-primary dark:bg-primary relative '>
        <div className='md:w-3/5'>
           <h4 className='text-white text-xl'>Welcome Jonathan Deo</h4>
           <p className='text-sm text-white font-medium mt-1'>Check all the statastics</p> 
           <div className='flex align-center rounded-full justify-between bg-gray-800/10 w-fit mt-4'>
                <div className='py-3 px-6 text-center'>
                     <h5 className='text-white text-lg leading-[normal]'>573</h5>
                     <small className='text-white text-xs font-medium  block ' >New Leads</small>   
                </div>
                <div className='py-3 px-6 text-center border-s border-white/20'>
                    <h5 className='text-white text-lg leading-[normal]'>87%</h5>
                    <small className='text-white text-xs font-medium  block ' >Conversion</small> 
                </div>
            </div>    
        </div>
        <Image
          src={Backgrond}
          alt="background"
          className="absolute 2xl:end-0 lg:-end-6 end-0  -top-7 sm:block hidden rtl:scale-x-[-1]"
        />
    </CardBox>
  )
}

export default Welcome

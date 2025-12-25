import React from 'react'
import { TextHoverEffect } from '../ui/TextHoverEffect'

const NoData = () => {
  return (
    <>
    <div className=" min-h-screen h-full mx-auto max-w-11xl bg-teal-50 flex items-center justify-center ">
      <TextHoverEffect text="No Data Available" />
    </div>
    </>
  )
}

export default NoData
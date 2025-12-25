import React, { useEffect } from 'react'
import HomeSetup from '../Common_Features/HomeSetup'
import TodayTask from './TodayTask'
import FeedBackBackground from '../Common_Features/FeedBack'
import { Footer } from '../Common_Features/Footer'

const Home = () => {

  return (
    <>
    <HomeSetup/>
    <TodayTask/>
    <FeedBackBackground/>
    <Footer/>
    </>
  )
}

export default Home
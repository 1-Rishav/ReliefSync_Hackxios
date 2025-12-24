import React from 'react'
import HomeSetup from '../Common_Features/HomeSetup'
import TodayArea from './TodayArea'
import FeedBackBackground from '../Common_Features/FeedBack'
import { Footer } from '../Common_Features/Footer'

const Home = () => {
  return (
    <>
    <HomeSetup/>
    <TodayArea/>
    <FeedBackBackground/>
    <Footer/>
    </>
  )
}

export default Home
import React from 'react'
import { Link } from 'react-router'
import BlurText from "./BlurText";
import { motion } from 'motion/react'
import resume3 from '../assets/resume3.png'
import resume4 from '../assets/resume4.png'
import Beams from './Beams';

const HeroSection = () => {

  return (
    <section className='flex h-150 w-full min-h-screen bg-black'>

      <div style={{ width: '100%', height: '600px', position: 'absolute' }}>
        <Beams
          beamWidth={3}
          beamHeight={30}
          beamNumber={12}
          lightColor="#ffffff"
          speed={1.5}
          noiseIntensity={1.5}
          scale={0.2}
          rotation={30}
        />
      </div>

      <div className='flex flex-col w-1/2 p-10 mt-25 gap-5 relative left-15 z-10'>
        <BlurText
          text="Build. Stand Out. Get Hired."
          delay={200}
          animateBy="words"
          direction="top"
          className="text-7xl elsie-black text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.3)]"
        />
        <BlurText
          text="Build a professional resume that puts your skills front and center. "
          delay={200}
          animateBy="words"
          direction="top"
          className="text-[18px] font-serif max-w-xl text-white/70"
        />
        <div className='flex gap-7 mt-3'>
          <Link
            to="/signup"
            className='bg-white text-black hover:bg-neutral-200 border rounded-2xl p-4 font-semibold text-sm transition-all cursor-pointer inline-flex items-center justify-center'
          >
            Create My Resume
          </Link>
          <Link
            to="/templates"
            className='border border-white/20 p-3.5 w-50 rounded-2xl bg-black hover:bg-white/10 text-white font-medium text-sm transition-all cursor-pointer inline-flex items-center justify-center'
          >
            View Templates
          </Link>
        </div>
        <div className='flex text-lg mt-3 text-blue-400 elsie-regular gap-3'>
          <p>Free to start</p>
          <p>Professional resumes</p>
          <p>Made simple</p>
        </div>
      </div>

      <div className="relative left-160 h-full scale-85">
        <motion.div
          className="absolute right-10 top-10 w-[420px]"
          initial={{ y: 500, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        >
          <img
            src={resume4}
            alt="Resume template"
            className="w-full rotate-6 shadow-[0_25px_60px_rgba(0,0,0,0.7)] hover:-translate-y-2 transition-transform duration-500 ease-out float-resume"
          />
        </motion.div>

        <motion.div
          className="absolute right-40 top-0 w-[420px]"
          initial={{ y: 500, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        >
          <img
            src={resume3}
            alt="Resume template"
            className="w-full -rotate-6 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.7)] hover:-translate-y-2 transition-transform duration-500 ease-out float-resume-slow"
          />
        </motion.div>
      </div>

    </section>
  )
}

export default HeroSection

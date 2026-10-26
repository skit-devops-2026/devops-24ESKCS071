import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { LuArrowLeft as ArrowLeft } from 'react-icons/lu'

export default function NotFound() {
  return (
    <div className='bg-black min-h-screen text-white flex flex-col items-center justify-center px-6 relative overflow-hidden'>
      {/* Subtle radial glow */}
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
        <div className='w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl' />
      </div>

      {/* Brand */}
      <Link
        to='/'
        className='absolute top-8 left-8 text-xl elsie-black tracking-tight text-white/70 hover:text-white transition-colors'
      >
        CraftCV
      </Link>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='flex flex-col items-center text-center relative z-10'
      >
        {/* Big 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className='text-[140px] md:text-[200px] elsie-black leading-none text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.08)] select-none'
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        >
          <p className='text-2xl md:text-3xl elsie-black text-white mt-2'>
            Page not found.
          </p>
          <p className='text-white/40 text-sm md:text-base mt-4 max-w-sm leading-relaxed'>
            The page you're looking for doesn't exist, or may have been moved.
            Let's get you back on track.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
          className='flex flex-col sm:flex-row gap-4 mt-10'
        >
          <Link
            to='/'
            className='flex items-center justify-center gap-2 bg-white text-black px-7 py-3 rounded-3xl font-medium hover:bg-white/90 transition-colors text-sm'
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
          <Link
            to='/templates'
            className='flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-3 rounded-3xl hover:border-white/40 hover:bg-white/5 transition-all text-sm'
          >
            Browse Templates
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className='absolute bottom-10 text-white/20 text-xs'
      >
        © {new Date().getFullYear()} CraftCV
      </motion.p>
    </div>
  )
}

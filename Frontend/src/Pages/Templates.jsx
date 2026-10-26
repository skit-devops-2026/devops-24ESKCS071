import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { LuEye as Eye, LuArrowRight as ArrowRight } from 'react-icons/lu';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import resume1 from '../assets/resume.png';
import resume2 from '../assets/resume2.png';
import resume3 from '../assets/resume3.png';
import resume4 from '../assets/resume4.png';

const CATEGORIES = ['All', 'Engineering', 'Design & Creative', 'Business & Finance', 'Fresh Graduate'];

const templates = [
  { id: 1,  name: 'Apex',        category: 'Engineering',        image: resume1 },
  { id: 2,  name: 'Nova',        category: 'Design & Creative',  image: resume2 },
  { id: 3,  name: 'Slate',       category: 'Business & Finance', image: resume3 },
  { id: 4,  name: 'Minimal Pro', category: 'Fresh Graduate',     image: resume4 },
  { id: 5,  name: 'Ember',       category: 'Design & Creative',  image: resume1 },
  { id: 6,  name: 'Clarity',     category: 'Engineering',        image: resume2 },
  { id: 7,  name: 'Serif',       category: 'Business & Finance', image: resume3 },
  { id: 8,  name: 'Blueprint',   category: 'Engineering',        image: resume4 },
  { id: 9,  name: 'Gradient',    category: 'Design & Creative',  image: resume1 },
  { id: 10, name: 'Clean Sheet', category: 'Fresh Graduate',     image: resume2 },
  { id: 11, name: 'Obsidian',    category: 'Business & Finance', image: resume3 },
  { id: 12, name: 'Aurora',      category: 'Design & Creative',  image: resume4 },
];

export default function Templates() {
  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <Navbar />

 
      <section className="pt-24 pb-10 max-w-7xl mx-auto px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex flex-col items-center text-center gap-4"
        >
          <h1 className="elsie-black text-5xl md:text-7xl leading-tight">
            Browse Templates
          </h1>
          <p className="text-white/60 text-lg max-w-xl">
            Pick a design that speaks for you. Every template is crafted to get past ATS and impress hiring managers.
          </p>
        </motion.div>
      </section>


      <section className="max-w-7xl mx-auto px-8 w-full pb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`rounded-full px-5 py-2 text-sm transition-all duration-200 cursor-pointer ${
                cat === 'All'
                  ? 'bg-white text-black font-medium'
                  : 'border border-white/20 text-white/60 hover:border-white/40 hover:text-white/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

 
      <section className="max-w-7xl mx-auto px-8 w-full pb-16 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 group flex flex-col"
            >
              <div className="overflow-hidden aspect-[3/4] w-full bg-[#111]">
                <img
                  src={template.image}
                  alt={`${template.name} resume template`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{template.name}</span>
                  <span className="text-xs bg-white/10 text-white/60 px-2.5 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <button className="flex-1 flex items-center justify-center gap-1.5 border border-white/30 text-white px-4 py-2 rounded-2xl hover:bg-white hover:text-black transition-all text-sm font-medium cursor-pointer">
                    <Eye size={14} />
                    Preview
                  </button>
                  <Link
                    to="/builder"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white text-black px-4 py-2 rounded-3xl hover:bg-white/90 transition-all text-sm font-medium"
                  >
                    Use Template
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

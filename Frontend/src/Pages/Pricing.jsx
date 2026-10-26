import { Link } from 'react-router'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { LuCheck as Check, LuStar as Star } from 'react-icons/lu'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started and build your first resume at no cost.',
    cta: 'Start for Free',
    ctaLink: '/signup',
    featured: false,
    features: ['1 active resume', '5 template choices', 'PDF export (with watermark)', 'Basic ATS check', 'Community support'],
    missing: ['Unlimited resumes', 'All premium templates', 'Watermark-free PDF', 'Advanced ATS scoring', 'AI suggestions', 'Priority support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'The complete toolkit for serious job seekers.',
    cta: 'Start Pro — Free 7-day Trial',
    ctaLink: '/signup',
    featured: true,
    badge: 'Most Popular',
    features: ['Unlimited resumes', 'All 40+ premium templates', 'Watermark-free PDF export', 'Advanced ATS scoring & tips', 'AI content suggestions', 'Cover letter builder', 'LinkedIn profile sync', 'Priority email support'],
    missing: [],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: 'per seat / year',
    description: 'For teams, universities, and career centers at scale.',
    cta: 'Contact Sales',
    ctaLink: '/signup',
    featured: false,
    features: ['Everything in Pro', 'Team management dashboard', 'Custom branding & templates', 'Bulk PDF generation', 'SAML / SSO authentication', 'Advanced analytics', 'Dedicated account manager', 'SLA guarantee'],
    missing: [],
  },
]

const faqs = [
  { q: 'Can I cancel my subscription anytime?',      a: 'Yes. You can cancel at any time from your account settings. You keep access until the end of your billing period.' },
  { q: 'Will my resumes be deleted if I downgrade?', a: "Your resumes are never deleted. On the free plan you can still view and download them — you just won't be able to create new ones beyond the limit." },
  { q: 'Is the 7-day Pro trial really free?',        a: "Absolutely. No credit card required to start the trial. You'll only be charged if you choose to continue after 7 days." },
  { q: 'What payment methods do you accept?',        a: 'We accept all major credit/debit cards (Visa, Mastercard, Amex) and PayPal.' },
  { q: 'Do you offer student discounts?',            a: 'Yes! Students with a verified .edu email address get 50% off Pro. Reach out to our support team to apply the discount.' },
]

const testimonials = [
  { quote: '"I landed a FAANG interview within two weeks of using CraftCV. The ATS score feature alone is worth it."', name: 'Priya S.',  role: 'Software Engineer at Google' },
  { quote: '"Finally a resume builder that doesn\'t look like it\'s from 2010. Clean, modern, and actually fast."',    name: 'Marcus T.', role: 'Product Designer at Figma' },
  { quote: '"Used it for my MBA applications. Got into 3 of my top 5 choices. Highly recommend Pro."',                name: 'Aisha K.',  role: 'MBA Candidate, Wharton' },
]

export default function Pricing() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-xs uppercase tracking-widest text-white/30 mb-4">Pricing</p>
          <h1 className="text-5xl md:text-7xl elsie-black text-white mb-4">Simple, Honest Pricing.</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">Start free. Upgrade when you're ready. No hidden fees, ever.</p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all ${
                plan.featured ? 'bg-white text-black border-white' : 'bg-[#0a0a0a] border-white/10 hover:border-white/30'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white text-xs px-4 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <p className={`text-xs uppercase tracking-widest mb-3 ${plan.featured ? 'text-black/50' : 'text-white/30'}`}>
                {plan.name}
              </p>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-5xl elsie-black">{plan.price}</span>
                {plan.price !== 'Custom' && (
                  <span className={`text-sm mb-2 ${plan.featured ? 'text-black/50' : 'text-white/40'}`}>
                    / {plan.period}
                  </span>
                )}
              </div>
              <p className={`text-sm mt-3 leading-relaxed ${plan.featured ? 'text-black/60' : 'text-white/50'}`}>
                {plan.description}
              </p>

              <Link
                to={plan.ctaLink}
                className={`mt-8 w-full py-3 rounded-2xl text-sm font-medium text-center transition-all block ${
                  plan.featured
                    ? 'bg-black text-white hover:bg-black/80'
                    : 'border border-white/30 text-white hover:bg-white hover:text-black'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <Check size={15} className={`mt-0.5 shrink-0 ${plan.featured ? 'text-black' : 'text-white/60'}`} />
                    <span className={`text-sm ${plan.featured ? 'text-black/80' : 'text-white/70'}`}>{f}</span>
                  </div>
                ))}
                {plan.missing.map((f) => (
                  <div key={f} className="flex items-start gap-3 opacity-30">
                    <div className="w-[15px] mt-0.5 shrink-0 flex justify-center">
                      <div className="w-3 h-[1.5px] bg-current rounded mt-2" />
                    </div>
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-white/10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-white/50 text-sm">
            Trusted by <span className="text-white font-medium">24,000+</span> job seekers across 60 countries
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm leading-relaxed">{t.quote}</p>
                <div className="mt-4">
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — static, all visible */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-4xl elsie-black text-white text-center mb-10">Frequently Asked</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.q} className="border border-white/10 rounded-2xl px-6 py-5 hover:border-white/20 transition-colors">
              <p className="text-sm font-medium text-white">{faq.q}</p>
              <p className="text-sm text-white/50 leading-relaxed mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center px-6 py-24 border-t border-white/10">
        <h2 className="text-5xl md:text-6xl elsie-black text-white mb-4">Ready to Get Hired?</h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          Join thousands of professionals who built their resume with CraftCV.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-white text-black px-8 py-4 rounded-3xl font-medium hover:bg-white/90 transition-colors text-sm"
        >
          Build My Resume — It's Free
        </Link>
      </section>

      <Footer />
    </div>
  )
}

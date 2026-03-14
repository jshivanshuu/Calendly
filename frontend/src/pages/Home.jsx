import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import logo from '../assets/images/brand-logo/logo.png'

const marketingNavItems = [
  { href: '#home', label: 'Home' },
  { href: '#product', label: 'Product' },
  { href: '#resources', label: 'Resources' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#pricing', label: 'Pricing' },
]

function RevealText({ as: Tag = 'div', className = '', delay = 0, children }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

export default function Home() {
  const [schedulingStep, setSchedulingStep] = useState(0)
  const [availabilityView, setAvailabilityView] = useState('Week')
  const [meetingsTab, setMeetingsTab] = useState('Upcoming')

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Interactive Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-purple-500 rounded-full animate-bounce animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-pink-500 rounded-full animate-bounce animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-5 h-5 bg-indigo-500 rounded-full animate-bounce animation-delay-3000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <a href="#home" className="flex items-center gap-3">
              <img src={logo} alt="Schedulr logo" className="h-10 w-auto" />
              <span className="text-lg font-semibold text-gray-900">Schedulr</span>
            </a>

            <nav className="hidden items-center gap-2 md:flex">
              {marketingNavItems.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-white hover:text-gray-900"
                >
                  {label}
                </a>
              ))}
            </nav>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div
          id="home"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-14 sm:pt-20 sm:pb-16"
        >
          <div className="text-center">
            {/* Logo and Title */}
            <RevealText
              className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
              delay={50}
            >
              <img src={logo} alt="Schedulr logo" className="h-16 w-auto sm:h-20" />
              <h1 className="text-5xl font-bold text-gray-900 tracking-tight sm:text-6xl lg:text-7xl">
                Schedulr
              </h1>
            </RevealText>

            <RevealText
              as="p"
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 sm:mb-12 sm:text-xl"
              delay={140}
            >
              Schedule meetings effortlessly with our powerful scheduling platform.
              Connect with others and manage your time like never before.
            </RevealText>

            {/* CTA Buttons */}
            <RevealText
              className="mb-14 flex flex-col justify-center gap-3 sm:mb-16 sm:flex-row sm:gap-4"
              delay={220}
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700"
              >
                Get Started
                <ArrowRight className="ml-2 -mr-1 w-4 h-4" />
              </Link>
              <Link
                to="/book/30min"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
              >
                View Demo
              </Link>
            </RevealText>
          </div>
        </div>

        {/* Section: Scheduling Hero */}
        <div id="product" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <RevealText as="h2" className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Schedule in seconds.
              </RevealText>
              <RevealText as="p" className="text-lg text-gray-600 mb-6" delay={100}>
                Create reusable event types, set duration & location, and share your link.
                No back-and-forth, just pick a time and get booked.
              </RevealText>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Create', 'Share', 'Book'].map((step, idx) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setSchedulingStep(idx)}
                    className={`rounded-2xl border p-5 text-left transition-all duration-200 ${
                      idx === schedulingStep
                        ? 'border-blue-300 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{step}</span>
                      <span className="text-xs font-medium text-gray-500">Step {idx + 1}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {idx === 0
                        ? 'Define your meeting template and availability.'
                        : idx === 1
                        ? 'Send your booking link via email or social.'
                        : 'Attendees pick a time and it auto-syncs.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-60" />
              <div className="relative">
                <RevealText as="h3" className="text-2xl font-semibold text-gray-900 mb-3">
                  Quick setup preview
                </RevealText>
                <RevealText as="p" className="text-gray-600 mb-6" delay={100}>
                  Jump into a template editor and see how easy it is to create a booking page.
                </RevealText>
                <div className="space-y-3">
                  <div className="rounded-lg bg-white p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">Event type</span>
                      <span className="text-xs text-gray-500">
                        {schedulingStep === 0 ? 'Selected' : 'Preview'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {schedulingStep === 0
                        ? '15 Minute Sync — Video call'
                        : schedulingStep === 1
                        ? 'Share your link & watch bookings appear'
                        : 'Booked slots auto-add to your calendar'}
                    </p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Start setting up
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Availability Hero */}
        <div id="solutions" className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <RevealText as="h2" className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Own your time.
                </RevealText>
                <RevealText as="p" className="text-lg text-gray-600 mb-6" delay={100}>
                  Set weekly availability once and let the system respect it automatically.
                  Block out time and never worry about double bookings.
                </RevealText>
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-gray-100 p-2">
                  {['Week', 'Day'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setAvailabilityView(mode)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        availabilityView === mode
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-white'
                      }`}
                    >
                      {mode} view
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50 via-white to-blue-50 opacity-50" />
                <div className="relative">
                  <RevealText as="h3" className="text-2xl font-semibold text-gray-900 mb-4">
                    Availability preview
                  </RevealText>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-500 mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="py-2 rounded-lg bg-white border border-gray-200">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {availabilityView === 'Week' ? (
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Weekly view:</span> Available 9am–5pm on weekdays, blocked on weekends.
                      </div>
                    ) : (
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Day view:</span> 9:00, 10:00, 11:00 slots available; 12:00 - 1:00 blocked.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Meetings Hero */}
        <div id="resources" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <RevealText as="h2" className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                See meetings at a glance.
              </RevealText>
              <RevealText as="p" className="text-lg text-gray-600 mb-6" delay={100}>
                Track upcoming sessions, review past meetings, and manage your schedule with clear visibility.
              </RevealText>
              <div className="flex flex-wrap gap-3">
                {['Upcoming', 'Past', 'Stats'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setMeetingsTab(tab)}
                    className={`px-5 py-3 rounded-lg font-medium transition-colors ${
                      meetingsTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-60" />
              <div className="relative">
                {meetingsTab === 'Upcoming' && (
                  <div>
                    <RevealText as="h3" className="text-2xl font-semibold text-gray-900 mb-3">
                      Upcoming meetings
                    </RevealText>
                    <ul className="space-y-3">
                      <li className="rounded-lg border border-gray-200 p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">Team sync</p>
                            <p className="text-sm text-gray-600">Tomorrow · 10:00 AM</p>
                          </div>
                          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                            Confirmed
                          </span>
                        </div>
                      </li>
                      <li className="rounded-lg border border-gray-200 p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">Client review</p>
                            <p className="text-sm text-gray-600">Next Monday · 2:00 PM</p>
                          </div>
                          <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}

                {meetingsTab === 'Past' && (
                  <div>
                    <RevealText as="h3" className="text-2xl font-semibold text-gray-900 mb-3">
                      Past meetings
                    </RevealText>
                    <ul className="space-y-3">
                      <li className="rounded-lg border border-gray-200 p-4 bg-white">
                        <p className="font-semibold text-gray-900">Project kickoff</p>
                        <p className="text-sm text-gray-600">Yesterday · 11:00 AM</p>
                      </li>
                      <li className="rounded-lg border border-gray-200 p-4 bg-white">
                        <p className="font-semibold text-gray-900">Design review</p>
                        <p className="text-sm text-gray-600">3 days ago · 9:00 AM</p>
                      </li>
                    </ul>
                  </div>
                )}

                {meetingsTab === 'Stats' && (
                  <div>
                    <RevealText as="h3" className="text-2xl font-semibold text-gray-900 mb-3">
                      Stats
                    </RevealText>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-gray-200 p-6 bg-white">
                        <p className="text-sm text-gray-500">Meetings booked</p>
                        <p className="text-3xl font-bold text-gray-900">24</p>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-6 bg-white">
                        <p className="text-sm text-gray-500">Avg meeting length</p>
                        <p className="text-3xl font-bold text-gray-900">35m</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div id="pricing" className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealText className="mb-10 text-center" delay={60}>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Simple pricing, clear value.</h2>
              <p className="mt-4 text-lg text-gray-600">
                Start free, scale when your team needs more booking power.
              </p>
            </RevealText>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
                <div className="text-gray-600">Meetings Scheduled</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">99%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

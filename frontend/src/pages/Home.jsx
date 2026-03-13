import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import logo from '../assets/images/brand-logo/logo.png'

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
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo and Title */}
            <div className="flex justify-center items-center mb-8">
              <img src={logo} alt="Schedulr logo" className="h-20 w-auto mr-6" />
              <h1 className="text-7xl font-bold text-gray-900 tracking-tight">
                Schedulr
              </h1>
            </div>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Schedule meetings effortlessly with our powerful scheduling platform.
              Connect with others and manage your time like never before.
            </p>

            {/* CTA Buttons */}
            <div className="flex justify-center space-x-4 mb-16">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Get Started
                <ArrowRight className="ml-2 -mr-1 w-4 h-4" />
              </Link>
              <Link
                to="/book/30min"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Section: Scheduling Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Schedule in seconds.
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Create reusable event types, set duration & location, and share your link.
                No back-and-forth, just pick a time and get booked.
              </p>
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
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Quick setup preview</h3>
                <p className="text-gray-600 mb-6">
                  Jump into a template editor and see how easy it is to create a booking page.
                </p>
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
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Own your time.
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Set weekly availability once and let the system respect it automatically.
                  Block out time and never worry about double bookings.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 p-2">
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
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Availability preview</h3>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                See meetings at a glance.
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Track upcoming sessions, review past meetings, and manage your schedule with clear visibility.
              </p>
              <div className="flex gap-3">
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
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">Upcoming meetings</h3>
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
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">Past meetings</h3>
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
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">Stats</h3>
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
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, MapPin, Globe, ChevronLeft, X } from 'lucide-react'
import Calendar from '../components/Calendar'
import TimeSlots from '../components/TimeSlots'
import { getPublicEvent, getAvailableSlots, getAvailability, createBooking } from '../api'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function formatSelectedDate(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function formatSlotTime(isoString) {
  const d = new Date(isoString)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default function PublicBooking() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [selectedDate, setSelectedDate] = useState(null)
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const [step, setStep] = useState('calendar') // calendar | form
  const [form, setForm] = useState({ name: '', email: '', notes: '' })
  const [booking, setBooking] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    async function init() {
      try {
        const [evt, avail] = await Promise.all([
          getPublicEvent(slug),
          getAvailability()
        ])
        setEvent(evt)
        setAvailability(avail)
      } catch (e) {
        if (e.response?.status === 404) setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [slug])

  useEffect(() => {
    if (!selectedDate || !event) return
    setSlotsLoading(true)
    setSelectedSlot(null)
    getAvailableSlots(slug, selectedDate)
      .then(data => setSlots(data.slots))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false))
  }, [selectedDate, event, slug])

  const availableDays = availability.filter(a => a.is_active).map(a => a.day_of_week)

  async function handleBook(e) {
    e.preventDefault()
    if (!selectedSlot) return
    setBooking(true)
    setBookingError('')
    try {
      const result = await createBooking(slug, {
        invitee_name: form.name,
        invitee_email: form.email,
        start_datetime: selectedSlot.start_datetime,
        notes: form.notes || null,
      })
      navigate(`/book/${slug}/confirmed`, {
        state: { booking: result, event }
      })
    } catch (err) {
      setBookingError(err.response?.data?.detail || 'Failed to book. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-500">This scheduling link is no longer active.</p>
        </div>
      </div>
    )
  }

  const eventColor = event?.color || '#006BFF'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Card container */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row min-h-[520px]">

        {/* ── Left Panel: Event Info ──────────────────────────────────────── */}
        <div className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 p-7 flex flex-col">
          {/* Back to admin (subtle) */}
          <a href="/" className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-6 transition-colors">
            <ChevronLeft className="w-3 h-3" />
            Admin
          </a>

          {/* Host avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4"
            style={{ backgroundColor: eventColor }}
          >
            A
          </div>
          <p className="text-xs text-gray-400 font-medium mb-1">Admin User</p>

          {/* Event name */}
          <h1 className="text-xl font-bold text-gray-900 mb-5 leading-tight">
            {event?.name}
          </h1>

          {/* Meta */}
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{event?.duration_minutes} minutes</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{event?.location}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{availability[0]?.timezone || 'UTC'}</span>
            </div>
          </div>

          {event?.description && (
            <p className="text-xs text-gray-400 mt-5 leading-relaxed">{event.description}</p>
          )}

          {/* Selected slot preview */}
          {selectedSlot && step === 'form' && (
            <div className="mt-auto pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Selected time</p>
              <p className="text-sm font-semibold text-gray-900">{formatSelectedDate(selectedDate)}</p>
              <p className="text-sm text-gray-600">{formatSlotTime(selectedSlot.start_datetime)}</p>
            </div>
          )}
        </div>

        {/* ── Middle/Right Panel ─────────────────────────────────────────── */}
        {step === 'calendar' ? (
          <>
            {/* Calendar panel */}
            <div className="flex-1 p-7 border-b md:border-b-0 md:border-r border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-5">Select a Date & Time</h2>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                availableDays={availableDays}
              />
            </div>

            {/* Time slots panel */}
            <div className="w-full md:w-52 p-7">
              {selectedDate ? (
                <>
                  <h3 className="font-medium text-gray-700 text-sm mb-4">
                    {formatSelectedDate(selectedDate)}
                  </h3>
                  <TimeSlots
                    slots={slots}
                    selectedSlot={selectedSlot}
                    onSelect={(slot) => {
                      setSelectedSlot(slot)
                      setStep('form')
                    }}
                    loading={slotsLoading}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-400">Select a date to see available times</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Booking Form */
          <div className="flex-1 p-7">
            <button
              onClick={() => setStep('calendar')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <h2 className="font-semibold text-gray-900 text-lg mb-1">Enter Details</h2>
            <p className="text-sm text-gray-500 mb-6">
              {formatSelectedDate(selectedDate)} at {formatSlotTime(selectedSlot?.start_datetime)}
            </p>

            <form onSubmit={handleBook} className="space-y-4 max-w-md">
              <div>
                <label className="label">Your Name *</label>
                <input
                  className="input"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input
                  className="input"
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Anything you'd like to share before the meeting…"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>

              {bookingError && (
                <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{bookingError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={booking}
                className="btn-primary w-full text-center"
                style={{ backgroundColor: eventColor }}
              >
                {booking ? 'Scheduling…' : 'Schedule Event'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By proceeding, you agree to our scheduling terms.
              </p>
            </form>
          </div>
        )}
      </div>

      {/* Branding */}
      <p className="text-xs text-gray-400 mt-5">
        Powered by <span className="font-semibold">Schedulr</span>
      </p>
    </div>
  )
}

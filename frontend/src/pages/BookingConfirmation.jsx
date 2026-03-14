import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, Calendar, Clock, Mail, MapPin, ArrowLeft, Home } from 'lucide-react'

function formatDate(isoString) {
  const d = new Date(isoString)
  return d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

function formatTime(isoString) {
  const d = new Date(isoString)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default function BookingConfirmation() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { slug } = useParams()

  const booking = state?.booking
  const event = state?.event

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500 mb-4">No booking information found.</p>
        <button onClick={() => navigate(`/book/${slug}`)} className="btn-primary">
          Book again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 text-center sm:p-8">

        {/* Success icon */}
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're scheduled!</h1>
        <p className="text-gray-500 text-sm mb-8">
          A calendar invitation has been sent to your email address.
        </p>

        {/* Meeting details */}
        <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3.5 mb-8">
          {/* Event name */}
          <div className="flex items-start gap-3">
            <div
              className="w-4 h-4 rounded-full mt-0.5 shrink-0"
              style={{ backgroundColor: event?.color || '#006BFF' }}
            />
            <div>
              <p className="font-semibold text-gray-900">{event?.name || 'Meeting'}</p>
              <p className="text-xs text-gray-400">with Admin User</p>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{formatDate(booking.start_datetime)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              {formatTime(booking.start_datetime)} – {formatTime(booking.end_datetime)}
              &nbsp;·&nbsp;{event?.duration_minutes} minutes
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{event?.location}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{booking.invitee_email}</span>
          </div>

          {booking.notes && (
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400 mb-1">Notes</p>
              <p className="text-sm text-gray-600">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate(`/book/${slug}`)}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Book another
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go home
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-5">
        Powered by <span className="font-semibold">Schedulr</span>
      </p>
    </div>
  )
}

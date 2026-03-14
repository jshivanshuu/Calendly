import { useState, useEffect } from 'react'
import { Calendar, Clock, Mail, Video, XCircle } from 'lucide-react'
import { getMeetings, cancelMeeting } from '../api'

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

export default function Meetings() {
  const [tab, setTab] = useState('upcoming')
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    fetchMeetings(tab)
  }, [tab])

  async function fetchMeetings(type) {
    setLoading(true)
    try {
      const data = await getMeetings(type)
      setMeetings(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(meeting) {
    if (!confirm(`Cancel meeting with ${meeting.invitee_name}?`)) return
    setCancelling(meeting.id)
    try {
      await cancelMeeting(meeting.id)
      setMeetings(m => m.filter(x => x.id !== meeting.id))
    } catch (e) {
      alert('Failed to cancel meeting')
    } finally {
      setCancelling(null)
    }
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage your scheduled meetings</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex w-full gap-1 rounded-xl bg-gray-100 p-1 sm:w-fit">
        {['upcoming', 'past'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-5 py-2 text-sm font-medium capitalize transition-all sm:flex-none ${
              tab === t
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="card p-5 h-24 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">
            No {tab} meetings
          </h3>
          <p className="text-gray-400 text-sm">
            {tab === 'upcoming'
              ? 'Share your booking link to get meetings scheduled'
              : 'Your past meetings will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map(meeting => {
            const eventColor = meeting.event_type?.color || '#006BFF'
            return (
              <div
                key={meeting.id}
                className="card flex flex-col gap-4 px-4 py-4 hover:shadow-md transition-shadow sm:px-5"
              >
                {/* Color dot */}
                <div
                  className="h-2 w-12 rounded-full shrink-0 sm:h-12 sm:w-2"
                  style={{ backgroundColor: eventColor }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {meeting.invitee_name}
                      </p>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {meeting.event_type?.name}
                      </p>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {formatDate(meeting.start_datetime)}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {formatTime(meeting.start_datetime)} – {formatTime(meeting.end_datetime)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Mail className="w-3 h-3" />
                      {meeting.invitee_email}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Video className="w-3 h-3" />
                      {meeting.event_type?.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {meeting.event_type?.duration_minutes} min
                    </span>
                  </div>
                </div>

                {/* Cancel (only upcoming) */}
                {tab === 'upcoming' && (
                  <button
                    onClick={() => handleCancel(meeting)}
                    disabled={cancelling === meeting.id}
                    className="btn-danger flex w-full items-center justify-center gap-2 shrink-0 sm:w-auto"
                  >
                    <XCircle className="w-4 h-4" />
                    {cancelling === meeting.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

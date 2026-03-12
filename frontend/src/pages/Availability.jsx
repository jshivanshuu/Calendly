import { useState, useEffect } from 'react'
import { Save, Info } from 'lucide-react'
import { getAvailability, updateAvailabilityBulk } from '../api'

const DAYS = [
  { label: 'Monday', short: 'Mon', value: 0 },
  { label: 'Tuesday', short: 'Tue', value: 1 },
  { label: 'Wednesday', short: 'Wed', value: 2 },
  { label: 'Thursday', short: 'Thu', value: 3 },
  { label: 'Friday', short: 'Fri', value: 4 },
  { label: 'Saturday', short: 'Sat', value: 5 },
  { label: 'Sunday', short: 'Sun', value: 6 },
]

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
  'UTC',
]

function defaultSchedule() {
  return DAYS.map(day => ({
    day_of_week: day.value,
    is_active: day.value < 5,  // Mon-Fri active
    start_time: '09:00',
    end_time: '17:00',
    timezone: 'America/New_York',
  }))
}

export default function Availability() {
  const [schedule, setSchedule] = useState(defaultSchedule())
  const [timezone, setTimezone] = useState('America/New_York')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchAvailability() }, [])

  async function fetchAvailability() {
    try {
      const data = await getAvailability()
      if (data.length > 0) {
        const tz = data[0].timezone
        setTimezone(tz)

        // Merge with defaults
        const merged = defaultSchedule().map(def => {
          const existing = data.find(d => d.day_of_week === def.day_of_week)
          return existing
            ? { ...def, ...existing }
            : def
        })
        setSchedule(merged)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function toggleDay(idx) {
    setSchedule(s => s.map((day, i) =>
      i === idx ? { ...day, is_active: !day.is_active } : day
    ))
  }

  function updateTime(idx, field, value) {
    setSchedule(s => s.map((day, i) =>
      i === idx ? { ...day, [field]: value } : day
    ))
  }

  function applyTimezoneAll() {
    setSchedule(s => s.map(day => ({ ...day, timezone })))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const payload = schedule.map(day => ({
        day_of_week: day.day_of_week,
        is_active: day.is_active,
        start_time: day.start_time,
        end_time: day.end_time,
        timezone: timezone,
      }))
      await updateAvailabilityBulk(payload)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      alert('Failed to save availability')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="card p-6 space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="text-gray-500 text-sm mt-1">Set when you're available for meetings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`btn-primary flex items-center gap-2 ${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Timezone */}
      <div className="card p-5 mb-5">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <label className="label">Timezone</label>
            <select
              className="input"
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1.5">
              All times are shown in this timezone to your invitees.
            </p>
          </div>
        </div>
      </div>

      {/* Weekly schedule */}
      <div className="card divide-y divide-gray-100">
        {schedule.map((day, idx) => {
          const dayInfo = DAYS[idx]
          return (
            <div
              key={day.day_of_week}
              className={`px-5 py-4 flex items-center gap-4 transition-opacity ${
                day.is_active ? '' : 'opacity-50'
              }`}
            >
              {/* Toggle */}
              <button
                onClick={() => toggleDay(idx)}
                className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${
                  day.is_active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                style={{ width: '40px', height: '22px' }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform"
                  style={{
                    width: '18px',
                    height: '18px',
                    transform: day.is_active ? 'translateX(18px)' : 'translateX(0)',
                  }}
                />
              </button>

              {/* Day label */}
              <span className="w-24 text-sm font-medium text-gray-700">
                {dayInfo.label}
              </span>

              {/* Time inputs */}
              {day.is_active ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    className="input flex-1 text-sm"
                    value={day.start_time}
                    onChange={e => updateTime(idx, 'start_time', e.target.value)}
                  />
                  <span className="text-gray-400 text-sm">–</span>
                  <input
                    type="time"
                    className="input flex-1 text-sm"
                    value={day.end_time}
                    onChange={e => updateTime(idx, 'end_time', e.target.value)}
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-400 flex-1">Unavailable</span>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
        <Info className="w-3 h-3" />
        Changes apply to all new bookings. Existing bookings are not affected.
      </p>
    </div>
  )
}

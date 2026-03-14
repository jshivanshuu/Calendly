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
    is_active: day.value < 5,
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

        const merged = defaultSchedule().map(def => {
          const existing = data.find(d => d.day_of_week === def.day_of_week)
          return existing ? { ...def, ...existing } : def
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

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const payload = schedule.map(day => ({
        day_of_week: day.day_of_week,
        is_active: day.is_active,
        start_time: day.start_time,
        end_time: day.end_time,
        timezone,
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
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse mb-6" />
        <div className="card p-6 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 rounded bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
            <p className="mt-1 text-sm text-gray-500">Set when you're available for meetings</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`btn-primary flex w-full items-center justify-center gap-2 sm:w-auto ${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="card mb-5 p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
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
              <p className="mt-1.5 text-xs text-gray-400">
                All times are shown in this timezone to your invitees.
              </p>
            </div>
          </div>
        </div>

        <div className="card divide-y divide-gray-100">
          {schedule.map((day, idx) => {
            const dayInfo = DAYS[idx]
            return (
              <div
                key={day.day_of_week}
                className={`px-4 py-4 transition-opacity sm:px-5 ${
                  day.is_active ? '' : 'opacity-50'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-3 sm:w-36 sm:shrink-0">
                    <button
                      onClick={() => toggleDay(idx)}
                      className={`relative shrink-0 rounded-full transition-colors ${
                        day.is_active ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                      style={{ width: '40px', height: '22px' }}
                    >
                      <span
                        className="absolute left-0.5 top-0.5 rounded-full bg-white shadow transition-transform"
                        style={{
                          width: '18px',
                          height: '18px',
                          transform: day.is_active ? 'translateX(18px)' : 'translateX(0)',
                        }}
                      />
                    </button>

                    <span className="text-sm font-medium text-gray-700">
                      <span className="sm:hidden">{dayInfo.short}</span>
                      <span className="hidden sm:inline">{dayInfo.label}</span>
                    </span>
                  </div>

                  {day.is_active ? (
                    <div className="flex flex-col gap-2 sm:flex-1 sm:flex-row sm:items-center">
                      <input
                        type="time"
                        className="input flex-1 text-sm"
                        value={day.start_time}
                        onChange={e => updateTime(idx, 'start_time', e.target.value)}
                      />
                      <span className="hidden text-sm text-gray-400 sm:inline">-</span>
                      <input
                        type="time"
                        className="input flex-1 text-sm"
                        value={day.end_time}
                        onChange={e => updateTime(idx, 'end_time', e.target.value)}
                      />
                    </div>
                  ) : (
                    <span className="flex-1 text-sm text-gray-400">Unavailable</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Info className="h-3 w-3" />
          Changes apply to all new bookings. Existing bookings are not affected.
        </p>
      </div>
    </div>
  )
}

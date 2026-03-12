import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export default function Calendar({ selectedDate, onDateSelect, availableDays = [] }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // First day of month (0=Sun)
  const firstDay = new Date(year, month, 1).getDay()
  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }

  function handleSelect(day) {
    const date = new Date(year, month, day)
    if (date < today) return

    // Check if this weekday has availability (0=Mon in Python, 0=Sun in JS)
    const jsWeekday = date.getDay()  // 0=Sun
    const pyWeekday = jsWeekday === 0 ? 6 : jsWeekday - 1  // convert to Mon=0
    if (availableDays.length > 0 && !availableDays.includes(pyWeekday)) return

    const iso = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    onDateSelect(iso)
  }

  function isSelected(day) {
    if (!selectedDate) return false
    const iso = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return iso === selectedDate
  }

  function isToday(day) {
    const d = new Date(year, month, day)
    return d.getTime() === today.getTime()
  }

  function isDisabled(day) {
    const d = new Date(year, month, day)
    if (d < today) return true
    const jsWeekday = d.getDay()
    const pyWeekday = jsWeekday === 0 ? 6 : jsWeekday - 1
    if (availableDays.length > 0 && !availableDays.includes(pyWeekday)) return true
    return false
  }

  // Build calendar grid
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  // Disable prev month if already current month
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  return (
    <div className="select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-gray-900">
          {MONTHS[month]} {year}
        </span>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            disabled={isCurrentMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const disabled = isDisabled(day)
          const selected = isSelected(day)
          const today_ = isToday(day)

          let cls = 'calendar-day mx-auto'
          if (selected) cls += ' selected'
          else if (disabled) cls += ' disabled'
          else if (today_) cls += ' today'

          return (
            <div
              key={day}
              className="flex justify-center"
              onClick={() => !disabled && handleSelect(day)}
            >
              <div className={cls}>{day}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

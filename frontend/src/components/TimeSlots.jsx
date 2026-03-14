export default function TimeSlots({ slots, selectedSlot, onSelect, loading }) {
  function formatTime(timeStr) {
    const [h, m] = timeStr.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${String(m).padStart(2,'0')} ${period}`
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-11 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">No available times</p>
        <p className="text-xs mt-1">Please select another date</p>
      </div>
    )
  }

  return (
    <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1 md:max-h-[420px]">
      {slots.map((slot) => (
        <button
          key={slot.start_datetime}
          onClick={() => onSelect(slot)}
          className={`time-slot ${selectedSlot?.start_datetime === slot.start_datetime ? 'selected' : ''}`}
        >
          {formatTime(slot.start)}
        </button>
      ))}
    </div>
  )
}

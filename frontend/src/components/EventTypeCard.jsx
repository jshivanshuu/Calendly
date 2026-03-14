import { Clock, Link2, Pencil, Trash2, MapPin } from 'lucide-react'

const colorMap = {
  '#006BFF': 'bg-blue-500',
  '#8B5CF6': 'bg-violet-500',
  '#10B981': 'bg-emerald-500',
  '#F59E0B': 'bg-amber-500',
  '#EF4444': 'bg-red-500',
  '#EC4899': 'bg-pink-500',
  '#14B8A6': 'bg-teal-500',
  '#F97316': 'bg-orange-500',
}

export default function EventTypeCard({ event, onEdit, onDelete }) {
  const publicUrl = `${window.location.origin}/book/${event.slug}`
  const colorClass = colorMap[event.color] || 'bg-blue-500'

  function copyLink() {
    navigator.clipboard.writeText(publicUrl)
      .then(() => alert('Link copied!'))
      .catch(() => {})
  }

  return (
    <div className="card p-5 hover:shadow-md transition-shadow group">
      {/* Color bar */}
      <div className={`w-10 h-1 rounded-full mb-4 ${colorClass}`} />

      {/* Name */}
      <h3 className="font-semibold text-gray-900 text-base mb-1">{event.name}</h3>

      {/* Duration + location */}
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {event.duration_minutes} min
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {event.location}
        </span>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
          {event.description}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Copy link */}
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          <Link2 className="w-3.5 h-3.5" />
          Copy link
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <a
            href={`/book/${event.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-blue-600 px-2 py-1 rounded transition-colors"
          >
            View
          </a>
          <button
            onClick={() => onEdit(event)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(event)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

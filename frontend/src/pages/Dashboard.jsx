import { useState, useEffect } from 'react'
import { Plus, X, Link, ExternalLink } from 'lucide-react'
import EventTypeCard from '../components/EventTypeCard'
import { getEventTypes, createEventType, updateEventType, deleteEventType } from '../api'

const COLORS = [
  { hex: '#006BFF', label: 'Blue' },
  { hex: '#8B5CF6', label: 'Purple' },
  { hex: '#10B981', label: 'Green' },
  { hex: '#F59E0B', label: 'Amber' },
  { hex: '#EF4444', label: 'Red' },
  { hex: '#EC4899', label: 'Pink' },
  { hex: '#14B8A6', label: 'Teal' },
  { hex: '#F97316', label: 'Orange' },
]

const DURATIONS = [15, 20, 30, 45, 60, 90, 120]

const emptyForm = {
  name: '',
  duration_minutes: 30,
  slug: '',
  description: '',
  color: '#006BFF',
  location: 'Video Call',
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editEvent, setEditEvent] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchEvents() }, [])

  async function fetchEvents() {
    try {
      const data = await getEventTypes()
      setEvents(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditEvent(null)
    setForm(emptyForm)
    setError('')
    setShowModal(true)
  }

  function openEdit(event) {
    setEditEvent(event)
    setForm({
      name: event.name,
      duration_minutes: event.duration_minutes,
      slug: event.slug,
      description: event.description || '',
      color: event.color,
      location: event.location,
    })
    setError('')
    setShowModal(true)
  }

  function handleNameChange(name) {
    setForm(f => ({
      ...f,
      name,
      slug: editEvent ? f.slug : slugify(name),
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editEvent) {
        const updated = await updateEventType(editEvent.id, form)
        setEvents(ev => ev.map(e => e.id === editEvent.id ? updated : e))
      } else {
        const created = await createEventType(form)
        setEvents(ev => [created, ...ev])
      }
      setShowModal(false)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(event) {
    if (!confirm(`Delete "${event.name}"? This cannot be undone.`)) return
    try {
      await deleteEventType(event.id)
      setEvents(ev => ev.filter(e => e.id !== event.id))
    } catch (err) {
      alert('Failed to delete event type')
    }
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage your scheduling event types</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex w-full items-center justify-center gap-2 sm:w-auto">
          <Plus className="w-4 h-4" />
          New Event Type
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="card p-5 h-44 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Link className="w-7 h-7 text-blue-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No event types yet</h3>
          <p className="text-gray-500 text-sm mb-5">Create your first event type to start accepting bookings</p>
          <button onClick={openCreate} className="btn-primary">
            Create Event Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <EventTypeCard
              key={event.id}
              event={event}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {editEvent ? 'Edit Event Type' : 'New Event Type'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Event Name *</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. 30 Minute Meeting"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Duration</label>
                  <select
                    className="input"
                    value={form.duration_minutes}
                    onChange={e => setForm(f => ({ ...f, duration_minutes: Number(e.target.value) }))}
                  >
                    {DURATIONS.map(d => (
                      <option key={d} value={d}>{d} minutes</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Location</label>
                  <input
                    className="input"
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Video Call"
                  />
                </div>
              </div>

              <div>
                <label className="label">URL Slug *</label>
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm border-r border-gray-200">
                    /book/
                  </span>
                  <input
                    className="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none"
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                    placeholder="30min"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  className="input resize-none"
                  rows={2}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of this meeting type"
                />
              </div>

              <div>
                <label className="label">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, color: c.hex }))}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        form.color === c.hex ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1" disabled={saving}>
                  {saving ? 'Saving…' : editEvent ? 'Save Changes' : 'Create Event Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

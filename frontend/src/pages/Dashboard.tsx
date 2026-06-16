import { useQuery } from '@tanstack/react-query'
import { getApplications } from '../api/applications'
import type { ApplicationStatus } from '../types'

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  in_progress: 'In Progress',
  rejected: 'Rejected',
  offer_received: 'Offer Received',
  accepted: 'Accepted',
  withdrawn: 'Withdrawn',
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  offer_received: 'bg-purple-100 text-purple-800',
  accepted: 'bg-green-100 text-green-800',
  withdrawn: 'bg-gray-100 text-gray-800',
}

export default function Dashboard() {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
  })

  if (isLoading) return <div className="p-8">Loading...</div>

  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<ApplicationStatus, number>)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(status => (
          <div key={status} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">{STATUS_LABELS[status]}</p>
            <p className="text-4xl font-bold text-gray-800">{counts[status] || 0}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Applications</h2>
      <div className="space-y-3">
        {applications.slice(0, 10).map(app => (
          <div key={app.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Application #{app.id}</p>
              <p className="text-sm text-gray-400">{app.date_applied}</p>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
              {STATUS_LABELS[app.status]}
            </span>
          </div>
        ))}
        {applications.length === 0 && (
          <p className="text-gray-400 text-sm">No applications yet.</p>
        )}
      </div>
    </div>
  )
}
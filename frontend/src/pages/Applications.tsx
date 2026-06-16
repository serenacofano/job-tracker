import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApplications, createApplication, deleteApplication } from '../api/applications'
import { getJobs } from '../api/jobs'
import { getCompanies } from '../api/companies'
import type { ApplicationStatus } from '../types'
import Navbar from '../components/Navbar'

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

export default function Applications() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [jobId, setJobId] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('applied')
  const [dateApplied, setDateApplied] = useState('')

  const { data: applications = [] } = useQuery({ queryKey: ['applications'], queryFn: getApplications })
  const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: getJobs })
  const { data: companies = [] } = useQuery({ queryKey: ['companies'], queryFn: getCompanies })

  const createMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      setShowForm(false)
      setJobId('')
      setDateApplied('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })

  const getJobRole = (job_id: number) => jobs.find(j => j.id === job_id)?.role ?? `Job #${job_id}`
  const getCompanyName = (job_id: number) => {
    const job = jobs.find(j => j.id === job_id)
    return job ? (companies.find(c => c.id === job.company_id)?.name ?? '—') : '—'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({ job_id: Number(jobId), status, date_applied: dateApplied })
  }

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Applications</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            {showForm ? 'Cancel' : '+ New Application'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job</label>
              <select
                value={jobId}
                onChange={e => setJobId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select a job</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.role} — {companies.find(c => c.id === job.company_id)?.name ?? 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ApplicationStatus)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Applied</label>
              <input
                type="date"
                value={dateApplied}
                onChange={e => setDateApplied(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
              Save Application
            </button>
          </form>
        )}

        <div className="space-y-3">
          {applications.map(app => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{getJobRole(app.job_id)}</p>
                <p className="text-sm text-gray-500">{getCompanyName(app.job_id)} · {app.date_applied}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
                  {STATUS_LABELS[app.status]}
                </span>
                <button
                  onClick={() => deleteMutation.mutate(app.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <p className="text-gray-400 text-sm">No applications yet.</p>
          )}
        </div>
      </div>
    </>
  )
}

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApplications, createApplication } from '../api/applications'
import { getJobs, createJob } from '../api/jobs'
import { getCompanies, createCompany } from '../api/companies'
import type { ApplicationStatus, JobType, JobQualification } from '../types'
import Navbar from '../components/Navbar'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'

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
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [showForm, setShowForm] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1 — Company
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const [creatingCompany, setCreatingCompany] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [companyType, setCompanyType] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [companyLocation, setCompanyLocation] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')

  // Step 2 — Job
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [creatingJob, setCreatingJob] = useState(false)
  const [jobRole, setJobRole] = useState('')
  const [jobType, setJobType] = useState<JobType>('junior')
  const [jobQualification, setJobQualification] = useState<JobQualification>('not_required')

  // Step 3 — Application
  const [status, setStatus] = useState<ApplicationStatus>('applied')
  const [dateApplied, setDateApplied] = useState('')
  const [cvUrl, setCvUrl] = useState('')

  // Filters
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | ''>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data: applications = [] } = useQuery({ queryKey: ['applications'], queryFn: getApplications })
  const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: getJobs })
  const { data: companies = [] } = useQuery({ queryKey: ['companies'], queryFn: getCompanies })

  const resetForm = () => {
    setShowForm(false)
    setStep(1)
    setSelectedCompanyId(null)
    setCreatingCompany(false)
    setCompanyName(''); setCompanyType(''); setCompanySize(''); setCompanyLocation(''); setCompanyWebsite('')
    setSelectedJobId(null)
    setCreatingJob(false)
    setJobRole(''); setJobType('junior'); setJobQualification('not_required')
    setStatus('applied'); setDateApplied(''); setCvUrl('')
  }

  const createCompanyMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: (company) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      setSelectedCompanyId(company.id)
      setCreatingCompany(false)
      setCompanyName(''); setCompanyType(''); setCompanySize(''); setCompanyLocation(''); setCompanyWebsite('')
      setStep(2)
    },
    onError: (error: any) => showToast(error.response?.data?.detail ?? 'Failed to create company')
  })

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      setSelectedJobId(job.id)
      setCreatingJob(false)
      setJobRole(''); setJobType('junior'); setJobQualification('not_required')
      setStep(3)
    },
    onError: (error: any) => showToast(error.response?.data?.detail ?? 'Failed to create job')
  })

  const createApplicationMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      resetForm()
    },
    onError: (error: any) => showToast(error.response?.data?.detail ?? 'Failed to create application')
  })

  const getJobRole = (job_id: number) => jobs.find(j => j.id === job_id)?.role ?? `Job #${job_id}`
  const getCompanyName = (job_id: number) => {
    const job = jobs.find(j => j.id === job_id)
    return job ? (companies.find(c => c.id === job.company_id)?.name ?? '—') : '—'
  }

  const filteredApplications = useMemo(() => {
    return applications
      .filter(app => {
        const role = getJobRole(app.job_id).toLowerCase()
        const company = getCompanyName(app.job_id).toLowerCase()
        const matchesSearch = role.includes(search.toLowerCase()) || company.includes(search.toLowerCase())
        const matchesStatus = filterStatus === '' || app.status === filterStatus
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        const diff = new Date(a.date_applied).getTime() - new Date(b.date_applied).getTime()
        return sortOrder === 'asc' ? diff : -diff
      })
  }, [applications, search, filterStatus, sortOrder, jobs, companies])

  const handleCompanyNext = () => {
    if (creatingCompany) {
      createCompanyMutation.mutate({
        name: companyName, type: companyType, size: companySize,
        location: companyLocation, website: companyWebsite || undefined
      })
    } else if (selectedCompanyId) {
      setStep(2)
    }
  }

  const handleJobNext = () => {
    if (creatingJob && selectedCompanyId) {
      createJobMutation.mutate({
        role: jobRole, type: jobType, qualification: jobQualification,
        skill_ids: [], company_id: selectedCompanyId
      })
    } else if (selectedJobId) {
      setStep(3)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJobId) return
    createApplicationMutation.mutate({
      job_id: selectedJobId, status, date_applied: dateApplied,
      cv_url: cvUrl || undefined
    })
  }

  const jobsForCompany = jobs.filter(j => j.company_id === selectedCompanyId)

  const step1Valid = creatingCompany
    ? companyName && companyType && companySize && companyLocation
    : selectedCompanyId !== null

  const step2Valid = creatingJob ? jobRole.trim() !== '' : selectedJobId !== null

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Applications</h1>
          <button
            onClick={() => showForm ? resetForm() : setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            {showForm ? 'Cancel' : '+ New Application'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            {/* Progress indicator */}
            <div className="flex items-center mb-6">
              {(['Company', 'Job', 'Application'] as const).map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className={`flex items-center gap-2 text-sm font-medium ${step === i + 1 ? 'text-blue-600' : step > i + 1 ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === i + 1 ? 'bg-blue-600 text-white' : step > i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {step > i + 1 ? '✓' : i + 1}
                    </span>
                    {label}
                  </div>
                  {i < 2 && <div className="mx-3 h-px w-8 bg-gray-200" />}
                </div>
              ))}
            </div>

            {/* Step 1 — Company */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-700">Which company did you apply to?</h2>
                {!creatingCompany ? (
                  <>
                    <select
                      value={selectedCompanyId ?? ''}
                      onChange={e => setSelectedCompanyId(Number(e.target.value) || null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Select a company</option>
                      {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="button" onClick={() => setCreatingCompany(true)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      + Create new company
                    </button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Google" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <input value={companyType} onChange={e => setCompanyType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Tech" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                        <input value={companySize} onChange={e => setCompanySize(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="1000+" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input value={companyLocation} onChange={e => setCompanyLocation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="London" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website (optional)</label>
                        <input value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="https://..." />
                      </div>
                    </div>
                    <button type="button" onClick={() => setCreatingCompany(false)} className="text-sm text-gray-500 hover:text-gray-700">
                      ← Select existing instead
                    </button>
                  </>
                )}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleCompanyNext}
                    disabled={!step1Valid}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Job */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-700">Which role did you apply for?</h2>
                {!creatingJob ? (
                  <>
                    <select
                      value={selectedJobId ?? ''}
                      onChange={e => setSelectedJobId(Number(e.target.value) || null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Select a job</option>
                      {jobsForCompany.map(j => <option key={j.id} value={j.id}>{j.role} ({j.type})</option>)}
                    </select>
                    {jobsForCompany.length === 0 && (
                      <p className="text-sm text-gray-400">No jobs found for this company.</p>
                    )}
                    <button type="button" onClick={() => setCreatingJob(true)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      + Create new job
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input value={jobRole} onChange={e => setJobRole(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Software Engineer" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select value={jobType} onChange={e => setJobType(e.target.value as JobType)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                            <option value="junior">Junior</option>
                            <option value="medior">Medior</option>
                            <option value="senior">Senior</option>
                            <option value="internship">Internship</option>
                            <option value="lead">Lead</option>
                            <option value="manager">Manager</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                          <select value={jobQualification} onChange={e => setJobQualification(e.target.value as JobQualification)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                            <option value="not_required">Not Required</option>
                            <option value="BSc">BSc</option>
                            <option value="MSc">MSc</option>
                            <option value="PhD">PhD</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setCreatingJob(false)} className="text-sm text-gray-500 hover:text-gray-700">
                      ← Select existing instead
                    </button>
                  </>
                )}
                <div className="flex justify-between pt-2">
                  <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleJobNext}
                    disabled={!step2Valid}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Application details */}
            {step === 3 && (
              <form onSubmit={handleSave} className="space-y-4">
                <h2 className="font-semibold text-gray-700">Application details</h2>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as ApplicationStatus)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CV URL (optional)</label>
                  <input
                    type="url"
                    value={cvUrl}
                    onChange={e => setCvUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex justify-between pt-2">
                  <button type="button" onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                    ← Back
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                    Save Application
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by role or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as ApplicationStatus | '')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>

        {/* Applications list */}
        <div className="space-y-3">
          {filteredApplications.map(app => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/applications/${app.id}`)}>
              <div>
                <p className="font-medium text-gray-800">{getJobRole(app.job_id)}</p>
                <p className="text-sm text-gray-500">{getCompanyName(app.job_id)} · {app.date_applied}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
                {STATUS_LABELS[app.status]}
              </span>
            </div>
          ))}
          {filteredApplications.length === 0 && (
            <p className="text-gray-400 text-sm">
              {applications.length === 0 ? 'No applications yet.' : 'No applications match your filters.'}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import { getApplication, deleteApplication, updateApplication } from "../api/applications"
import { getJobs } from "../api/jobs"
import { getCompanies } from "../api/companies"
import { getInterviews, createInterview } from "../api/interviews"
import Navbar from "../components/Navbar"
import { useToast } from "../context/ToastContext"
import type { ApplicationStatus, InterviewOutcome, InterviewType, InterviewerRole } from "../types"

const STATUS_LABELS: Record<ApplicationStatus, string> = {
    applied: 'Applied',
    in_progress: 'In Progress',
    rejected: 'Rejected',
    offer_received: 'Offer Received',
    accepted: 'Accepted',
    withdrawn: 'Withdrawn',
}

const OUTCOME_COLORS: Record<InterviewOutcome, string> = {
    passed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
}

export default function ApplicationsDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    const [editing, setEditing] = useState(false)
    const [editStatus, setEditStatus] = useState<ApplicationStatus>('applied')
    const [editDateApplied, setEditDateApplied] = useState('')

    const [showInterviewForm, setShowInterviewForm] = useState(false)
    const [intType, setIntType] = useState<InterviewType>('behavioural')
    const [intRole, setIntRole] = useState<InterviewerRole>('hr')
    const [intDate, setIntDate] = useState('')
    const [intQuestions, setIntQuestions] = useState('')
    const [intOutcome, setIntOutcome] = useState<InterviewOutcome>('pending')
    const [intFeeling, setIntFeeling] = useState('')

    const { data: application } = useQuery({ queryKey: ['applications', id], queryFn: () => getApplication(Number(id)) })
    const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: getJobs })
    const { data: companies = [] } = useQuery({ queryKey: ['companies'], queryFn: getCompanies })
    const { data: interviews = [] } = useQuery({ queryKey: ['interviews'], queryFn: getInterviews })

    const job = jobs.find(j => j.id === application?.job_id)
    const company = companies.find(c => c.id === job?.company_id)
    const appInterviews = interviews.filter(i => i.application_id === Number(id))

    const deleteMutation = useMutation({
        mutationFn: deleteApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] })
            navigate('/applications')
        },
        onError: (error: any) => showToast(error.response?.data?.detail ?? 'Failed to delete application')
    })

    const updateMutation = useMutation({
        mutationFn: updateApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications', id] })
            setEditing(false)
        },
        onError: (error: any) => showToast(error.response?.data?.detail ?? 'Failed to update application')
    })

    const handleEdit = () => {
        if (!application) return
        setEditStatus(application.status)
        setEditDateApplied(application.date_applied)
        setEditing(true)
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!application) return
        updateMutation.mutate({ id: application.id, data: { status: editStatus, date_applied: editDateApplied } })
    }

    const createInterviewMutation = useMutation({
        mutationFn: createInterview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] })
            setShowInterviewForm(false)
            setIntType('behavioural')
            setIntRole('hr')
            setIntDate('')
            setIntQuestions('')
            setIntOutcome('pending')
            setIntFeeling('')
        },
        onError: (error: any) => showToast(error.response?.data?.detail ?? 'Failed to create interview')
    })

    const handleAddInterview = (e: React.FormEvent) => {
        e.preventDefault()
        if (!application) return
        createInterviewMutation.mutate({
            application_id: application.id,
            type: intType,
            interviewer_role: intRole,
            date: intDate,
            questions: intQuestions || undefined,
            outcome: intOutcome,
            feeling: parseInt(intFeeling),
        })
    }

    const handleDelete = () => {
        if (!application) return
        if (!window.confirm('Are you sure you want to delete this application? This cannot be undone.')) return
        deleteMutation.mutate(application.id)
    }

    return (
        <>
            <Navbar />
            <div className="p-8 max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
                    ← Back
                </button>

                {application && (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{job?.role ?? 'Unknown role'}</h1>
                                    <p className="text-gray-500 mt-1">{company?.name ?? 'Unknown company'} · {company?.location}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleEdit} className="text-sm text-blue-500 hover:text-blue-700 font-medium">Edit</button>
                                    <button onClick={handleDelete} className="text-sm text-red-400 hover:text-red-600 font-medium">Delete</button>
                                </div>
                            </div>

                            {editing ? (
                                <form onSubmit={handleUpdate} className="border-t border-gray-100 pt-4 space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select value={editStatus} onChange={e => setEditStatus(e.target.value as ApplicationStatus)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                            {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(s => (
                                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Applied</label>
                                        <input type="date" value={editDateApplied} onChange={e => setEditDateApplied(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">Save</button>
                                        <button type="button" onClick={() => setEditing(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                    <div><p className="text-gray-400">Status</p><p className="font-medium text-gray-800">{STATUS_LABELS[application.status]}</p></div>
                                    <div><p className="text-gray-400">Date Applied</p><p className="font-medium text-gray-800">{application.date_applied}</p></div>
                                    <div><p className="text-gray-400">Job Type</p><p className="font-medium text-gray-800">{job?.type}</p></div>
                                    <div><p className="text-gray-400">Qualification</p><p className="font-medium text-gray-800">{job?.qualification}</p></div>
                                    <div><p className="text-gray-400">Company Size</p><p className="font-medium text-gray-800">{company?.size}</p></div>
                                    <div><p className="text-gray-400">Company Type</p><p className="font-medium text-gray-800">{company?.type}</p></div>
                                    {application.cv_url && (
                                        <div><p className="text-gray-400">CV</p><a href={application.cv_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Link</a></div>
                                    )}
                                    {application.cover_letter_url && (
                                        <div><p className="text-gray-400">Cover Letter</p><a href={application.cover_letter_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Link</a></div>
                                    )}
                                    {company?.website && (
                                        <div><p className="text-gray-400">Website</p><a href={company.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{company.website}</a></div>
                                    )}
                                    {company?.notes && (
                                        <div className="col-span-2"><p className="text-gray-400">Notes</p><p className="font-medium text-gray-800">{company.notes}</p></div>
                                    )}
                                </div>
                            )}

                            {job && job.skills.length > 0 && !editing && (
                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-xs text-gray-400 mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-1">
                                        {job.skills.map(s => (
                                            <span key={s.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-semibold text-gray-800">Interviews</h2>
                            <button
                                onClick={() => setShowInterviewForm(v => !v)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {showInterviewForm ? 'Cancel' : '+ Add Interview'}
                            </button>
                        </div>

                        {showInterviewForm && (
                            <form onSubmit={handleAddInterview} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <select value={intType} onChange={e => setIntType(e.target.value as InterviewType)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                            <option value="behavioural">Behavioural</option>
                                            <option value="technical">Technical</option>
                                            <option value="phone_screen">Phone Screen</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer Role</label>
                                        <select value={intRole} onChange={e => setIntRole(e.target.value as InterviewerRole)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                            <option value="hr">HR</option>
                                            <option value="technical">Technical</option>
                                            <option value="manager">Manager</option>
                                            <option value="ceo">CEO</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input type="date" value={intDate} min={application.date_applied} onChange={e => setIntDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Feeling (1–5)</label>
                                        <input type="number" min={1} max={5} value={intFeeling} onChange={e => setIntFeeling(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                                        <select value={intOutcome} onChange={e => setIntOutcome(e.target.value as InterviewOutcome)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                            <option value="pending">Pending</option>
                                            <option value="passed">Passed</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Questions (optional)</label>
                                    <textarea value={intQuestions} onChange={e => setIntQuestions(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} />
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium text-sm">
                                    Save Interview
                                </button>
                            </form>
                        )}

                        {appInterviews.length === 0 ? (
                            <p className="text-gray-400 text-sm">No interviews yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {appInterviews.map(i => (
                                    <div key={i.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-800">{i.type} · {i.interviewer_role}</p>
                                            <p className="text-sm text-gray-500">{i.date} · Feeling: {i.feeling}/5</p>
                                            {i.questions && <p className="text-sm text-gray-400 mt-1">{i.questions}</p>}
                                        </div>
                                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${OUTCOME_COLORS[i.outcome]}`}>
                                            {i.outcome}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

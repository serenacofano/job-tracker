import { getInterviews, createInterview, deleteInterview, updateInterview } from '../api/interviews'
import { getApplications } from '../api/applications'
import { getJobs } from '../api/jobs'
import type { InterviewType, InterviewerRole, InterviewOutcome, Interview } from '../types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function Interviews() {
    const queryClient = useQueryClient()
    const [showForm, setShowForm] = useState(false)
    const [applicationId, setApplicationId] = useState('')
    const [interviewerRole, setInterviewerRole] = useState<InterviewerRole> ('hr')
    const [type, setType] = useState<InterviewType> ('behavioural')
    const [date, setDate] = useState('')
    const [questions, setQuestions] = useState('')
    const [outcome, setOutcome] = useState<InterviewOutcome> ('pending')
    const [feeling, setFeeling] = useState('')

    const [editingInt, setEditingInt] = useState<Interview | null>(null)
    const [editRole, setEditRole] = useState<InterviewerRole>('hr')
    const [editDate, setEditDate] = useState('')    
    const [editQuestions, setEditQuestions] = useState('')
    const [editOutcome, setEditOutcome] = useState<InterviewOutcome>('pending')

    const { data: applications = [] } = useQuery({ queryKey: ['applications'], queryFn: getApplications })
    const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: getJobs })
    const { data: interviews = [] } = useQuery({ queryKey: ['interviews'], queryFn: getInterviews })

    const createMutation = useMutation({
        mutationFn: createInterview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] })
            setShowForm(false)
            setApplicationId('')
            setInterviewerRole('hr')
            setType('behavioural')
            setDate('')
            setQuestions('')
            setOutcome('pending')
            setFeeling('')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteInterview,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
    })

    const updateMutation = useMutation({
        mutationFn: updateInterview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] })
            setEditingInt(null)
            setEditRole('hr')
            setEditDate('')
            setEditQuestions('')
            setEditOutcome('pending')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createMutation.mutate({ application_id: parseInt(applicationId), type, interviewer_role: interviewerRole, date, questions: questions || undefined, outcome, feeling: parseInt(feeling) })
    }

    const handleEdit = (interview: Interview) => {
        setEditingInt(interview)
        setEditRole(interview.interviewer_role)
        setEditDate(interview.date)
        setEditQuestions(interview.questions ?? '')
        setEditOutcome(interview.outcome)
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingInt) return
        updateMutation.mutate({ id: editingInt.id, data: { interviewer_role: editRole, date: editDate, questions: editQuestions || undefined, outcome: editOutcome } })
    }

    const getJobRole = (application_id: number) => {
        const app = applications.find(a => a.id === application_id)
        return app ? (jobs.find(j => j.id === app.job_id)?.role ?? `Job #${app.job_id}`) : `App #${application_id}`
    }

    const OUTCOME_COLORS: Record<InterviewOutcome, string> = {
        passed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
    }

    return (
        <>
            <Navbar />
            <div className="p-8 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Interviews</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                        {showForm ? 'Cancel' : '+ New Interview'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Application</label>
                            <select value={applicationId} onChange={e => setApplicationId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                                <option value="">Select an application</option>
                                {applications.map(app => (
                                    <option key={app.id} value={app.id}>{getJobRole(app.id)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select value={type} onChange={e => setType(e.target.value as InterviewType)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                                <option value="behavioural">Behavioural</option>
                                <option value="technical">Technical</option>
                                <option value="phone_screen">Phone Screen</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer Role</label>
                            <select value={interviewerRole} onChange={e => setInterviewerRole(e.target.value as InterviewerRole)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                                <option value="hr">HR</option>
                                <option value="technical">Technical</option>
                                <option value="manager">Manager</option>
                                <option value="ceo">CEO</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                            <textarea value={questions} onChange={e => setQuestions(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                            <select value={outcome} onChange={e => setOutcome(e.target.value as InterviewOutcome)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                                <option value="pending">Pending</option>
                                <option value="passed">Passed</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Feeling (1–5)</label>
                            <input type="number" min={1} max={5} value={feeling} onChange={e => setFeeling(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
                            Save Interview
                        </button>
                    </form>
                )}

                {editingInt && (
                    <form onSubmit={handleUpdate} className="bg-yellow-50 rounded-xl border border-yellow-200 p-6 mb-6 space-y-4">
                        <p className="font-medium text-gray-700">Editing: {getJobRole(editingInt.application_id)}</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer Role</label>
                            <select value={editRole} onChange={e => setEditRole(e.target.value as InterviewerRole)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                                <option value="hr">HR</option>
                                <option value="technical">Technical</option>
                                <option value="manager">Manager</option>
                                <option value="ceo">CEO</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                            <textarea value={editQuestions} onChange={e => setEditQuestions(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                            <select value={editOutcome} onChange={e => setEditOutcome(e.target.value as InterviewOutcome)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                                <option value="pending">Pending</option>
                                <option value="passed">Passed</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 font-medium">Update</button>
                            <button type="button" onClick={() => setEditingInt(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
                        </div>
                    </form>
                )}

                <div className="space-y-3">
                    {interviews.map(interview => (
                        <div key={interview.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-800">{getJobRole(interview.application_id)}</p>
                                <p className="text-sm text-gray-500">{interview.type} · {interview.interviewer_role} · {interview.date} · Feeling: {interview.feeling}/5</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${OUTCOME_COLORS[interview.outcome]}`}>
                                    {interview.outcome}
                                </span>
                                <button onClick={() => handleEdit(interview)} className="text-blue-400 hover:text-blue-600 text-sm">Edit</button>
                                <button onClick={() => deleteMutation.mutate(interview.id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                            </div>
                        </div>
                    ))}
                    {interviews.length === 0 && (
                        <p className="text-gray-400 text-sm">No interviews yet.</p>
                    )}
                </div>
            </div>
        </>
    )
}

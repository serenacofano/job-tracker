import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJobs, createJob, deleteJob } from '../api/jobs'
import { getSkills, createSkill } from '../api/skills'
import type { JobType, JobQualification, SkillCategory } from '../types'
import Navbar from '../components/Navbar'
import { getCompanies } from '../api/companies'
import { useToast } from '../context/ToastContext'

export default function Jobs() {
    const queryClient = useQueryClient()
    const [showForm, setShowForm] = useState(false)
    const [role, setRole] = useState('')
    const [type, setType] = useState<JobType>('junior')
    const [qualification, setQualification] = useState<JobQualification>('not_required')
    const [companyId, setCompanyId] = useState('')
    const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([])
    const [showSkillModal, setShowSkillModal] = useState(false)
    const [newSkillName, setNewSkillName] = useState('')
    const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('tech')

    const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: getJobs })
    const { data: companies = [] } = useQuery({ queryKey: ['companies'], queryFn: getCompanies })
    const { data: skills = [] } = useQuery({ queryKey: ['skills'], queryFn: getSkills })

    const { showToast } = useToast()

    const createMutation = useMutation({
        mutationFn: createJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            setShowForm(false)
            setRole('')
            setType('junior')
            setQualification('not_required')
            setCompanyId('')
            setSelectedSkillIds([])
        },
        onError: (error: any) => showToast(error.response?.data?.detail ?? 'Failed to create job')
    })

    const createSkillMutation = useMutation({
        mutationFn: createSkill,
        onSuccess: (newSkill) => {
            queryClient.invalidateQueries({ queryKey: ['skills'] })
            setSelectedSkillIds(prev => [...prev, newSkill.id])
            setNewSkillName('')
            setShowSkillModal(false)
        },
        onError: (error: any) => showToast(error.response?.data?.detail ?? 'Failed to create skill')
    })

    const deleteMutation = useMutation({
        mutationFn: deleteJob,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
        onError: (error: any) => showToast(error.response?.data?.detail ?? 'Failed to delete job')
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createMutation.mutate({ role, type, qualification, skill_ids: selectedSkillIds, company_id: parseInt(companyId) })
    }

    const handleSkillSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(e.target.value)
        if (!id || selectedSkillIds.includes(id)) return
        setSelectedSkillIds(prev => [...prev, id])
        e.target.value = ''
    }

    const handleRemoveSkill = (id: number) => {
        setSelectedSkillIds(prev => prev.filter(s => s !== id))
    }

    const handleCreateSkill = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSkillName.trim()) return
        createSkillMutation.mutate({ name: newSkillName.trim(), category: newSkillCategory })
    }

    const selectedSkills = skills.filter(s => selectedSkillIds.includes(s.id))

    return (
        <>
        <Navbar />
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Jobs</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                    {showForm ? 'Cancel' : '+ New Job'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                            type="text"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select value={type} onChange={e => setType(e.target.value as JobType)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
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
                        <select value={qualification} onChange={e => setQualification(e.target.value as JobQualification)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                            <option value="BSc">BSc</option>
                            <option value="MSc">MSc</option>
                            <option value="PhD">PhD</option>
                            <option value="not_required">Not Required</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <select value={companyId} onChange={e => setCompanyId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                            <option value="">Select a company</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Skills</label>
                            <button
                                type="button"
                                onClick={() => setShowSkillModal(true)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                + New Skill
                            </button>
                        </div>
                        <select
                            onChange={handleSkillSelect}
                            defaultValue=""
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">Select a skill to add</option>
                            {skills.filter(s => !selectedSkillIds.includes(s.id)).map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                            ))}
                        </select>
                        {selectedSkills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedSkills.map(s => (
                                    <span key={s.id} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {s.name}
                                        <button type="button" onClick={() => handleRemoveSkill(s.id)} className="hover:text-blue-600 font-bold">×</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
                        Save Job
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {jobs.map(job => (
                    <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-800">{job.role}</p>
                            <p className="text-sm text-gray-500">{companies.find(c => c.id === job.company_id)?.name ?? 'Unknown'} · {job.type}</p>
                            {job.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {job.skills.map(s => (
                                        <span key={s.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => deleteMutation.mutate(job.id)}
                            className="text-sm text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {showSkillModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowSkillModal(false)}>
                <div className="bg-white rounded-xl p-6 w-96 shadow-xl" onClick={e => e.stopPropagation()}>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Skill</h2>
                    <form onSubmit={handleCreateSkill} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Python, Communication"
                                value={newSkillName}
                                onChange={e => setNewSkillName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={newSkillCategory}
                                onChange={e => setNewSkillCategory(e.target.value as SkillCategory)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value="tech">Tech</option>
                                <option value="soft">Soft</option>
                            </select>
                        </div>
                        <div className="flex gap-2 pt-1">
                            <button type="button" onClick={() => setShowSkillModal(false)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    )
}

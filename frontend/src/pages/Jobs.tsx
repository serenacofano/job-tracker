import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJobs, createJob, deleteJob } from '../api/jobs'
import type { Job } from '../types'
import Navbar from '../components/Navbar'
import { getCompanies } from '../api/companies'

export default function Jobs() {
    const queryClient = useQueryClient()
    const [showForm, setShowForm] = useState(false)
    const [role, setRole] = useState('')
    const [type, setType] = useState('')
    const [qualification, setQualification] = useState('')
    const [techRequirements, setTechRequirements] = useState('')
    const [softSkills, setSoftSkills] = useState('')
    const [companyId, setCompanyId] = useState('')

    const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: getJobs })
    const { data: companies = [] } = useQuery({ queryKey: ['companies'], queryFn: getCompanies })

    const createMutation = useMutation({
        mutationFn: createJob,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jobs'] })
        setShowForm(false)
        setRole('')
        setType('')
        setQualification('')
        setTechRequirements('')
        setSoftSkills('')
        setCompanyId('')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteJob,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createMutation.mutate({ role, type, qualification, tech_requirements: techRequirements, soft_skills: softSkills, company_id: parseInt(companyId) })
    }

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
                <input
                    type="text"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <input
                    type="text"
                    value={qualification}
                    onChange={e => setQualification(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tech Requirements</label>
                <input
                    type="text"
                    value={techRequirements}
                    onChange={e => setTechRequirements(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soft Skills</label>
                <input
                    type="text"
                    value={softSkills}
                    onChange={e => setSoftSkills(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                />
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
        </>
    )
}


import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCompanies, createCompany, deleteCompany } from '../api/companies'
import Navbar from '../components/Navbar'
import { useToast } from '../context/ToastContext'

export default function Companies() {
    const queryClient = useQueryClient()
    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [size, setSize] = useState('')
    const [location, setLocation] = useState('')
    const [website, setWebsite] = useState('')
    const [notes, setNotes] = useState('')

    const [search, setSearch] = useState('')

    const { data: companies = [] } = useQuery({ queryKey: ['companies'], queryFn: getCompanies })

    const { showToast } = useToast()

    const filteredCompanies = useMemo(() => {
        return companies.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.location.toLowerCase().includes(search.toLowerCase())
        )
    }, [companies, search])

    const createMutation = useMutation({
        mutationFn: createCompany,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['companies'] })
        setShowForm(false)
        setName('')
        setLocation('')
        setType('')
        setSize('')
        setWebsite('')
        setNotes('')
        },
        onError: (error: any) => showToast(error.response?.data?.detail ?? 'Failed to create company')
    })

    const deleteMutation = useMutation({
        mutationFn: deleteCompany,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
        onError: (error: any) => showToast(error.response?.data?.detail ?? 'Failed to delete company')
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createMutation.mutate({ name, type, size, location, website: website || undefined, notes: notes || undefined })
    }

    return (
        <>
        <Navbar />
            <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Companies</h1>
            <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                {showForm ? 'Cancel' : '+ New Company'}
            </button>
            </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <input
                    type="text"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                    type="text"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    
                />
            </div>
             <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
                Save Company
                </button>
            </form>
            )}
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search by name or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
        </div>

        <div className="space-y-3">
        {filteredCompanies.map(company => (
            <div key={company.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
            <div>
                <p className="font-medium text-gray-800">{company.name}</p>
                <p className="text-sm text-gray-500">{company.type} · {company.size} · {company.location}</p>
            </div>
            <button
                onClick={() => deleteMutation.mutate(company.id)}
                className="text-red-400 hover:text-red-600 text-sm"
            >
                Delete
            </button>
            </div>
        ))}
        {filteredCompanies.length === 0 && (
            <p className="text-gray-400 text-sm">
                {companies.length === 0 ? 'No companies yet.' : 'No companies match your search.'}
            </p>
        )}
        </div>
        </div>

          </>
          )
}
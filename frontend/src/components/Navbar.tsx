import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <div className="flex gap-6">
        <a href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</a>
        <a href="/applications" className="text-gray-700 hover:text-blue-600 font-medium">Applications</a>
        <a href="/companies" className="text-gray-700 hover:text-blue-600 font-medium">Companies</a>
        <a href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium">Jobs</a>
        <a href="/interviews" className="text-gray-700 hover:text-blue-600 font-medium">Interviews</a>
      </div>
      <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500">Logout</button>
    </nav>
  )
}

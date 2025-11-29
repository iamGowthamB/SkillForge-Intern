import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { Menu, X, BookOpen, LogOut, User, LayoutDashboard, Plus } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  // Role-based navigation links
  const getNavLinks = () => {
    const commonLinks = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ]

    if (user?.role === 'INSTRUCTOR') {
      return [
        ...commonLinks,
        { name: 'My Courses', path: '/courses', icon: BookOpen },
        { name: 'Create Course', path: '/courses/create', icon: Plus },
      ]
    } else if (user?.role === 'STUDENT') {
      return [
        ...commonLinks,
        { name: 'Browse Courses', path: '/courses', icon: BookOpen },
        { name: 'My Courses', path: '/my-courses', icon: BookOpen },
      ]
    } else {
      return [
        ...commonLinks,
        { name: 'All Courses', path: '/courses', icon: BookOpen },
      ]
    }
  }

  const navLinks = getNavLinks()

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SF</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkillForge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                >
                  <Icon size={20} />
                  <span>{link.name}</span>
                </Link>
              )
            })}

            {/* User Menu */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User size={18} className="text-gray-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t animate-slide-in">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <Icon size={20} />
                  <span>{link.name}</span>
                </Link>
              )
            })}

            <div className="pt-3 border-t">
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-100 rounded-lg mb-2">
                <User size={18} className="text-gray-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 
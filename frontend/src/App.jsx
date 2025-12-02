import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-12">
          BIM Drawing Manager
        </h1>
        <Dashboard />
      </div>
    </div>
  )
}

export default App

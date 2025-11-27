import HealthCheck from './components/HealthCheck'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          BIM Drawing Manager
        </h1>
        <HealthCheck />
      </div>
    </div>
  )
}

export default App

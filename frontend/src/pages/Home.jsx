import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Your BIM Drawings with Ease
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Streamline your architectural drawing workflow. Upload, organize, and manage
            your Revit PDFs with automatic renaming and revision tracking.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
          >
            Go to Projects
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="bg-indigo-100 rounded-lg p-3 w-fit mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Auto-Rename Files</h3>
          <p className="text-gray-600 leading-relaxed">
            Upload Revit exports and automatically rename them with sheet numbers, descriptions,
            and revision codes. Save 30+ minutes per upload.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="bg-green-100 rounded-lg p-3 w-fit mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Organized Projects</h3>
          <p className="text-gray-600 leading-relaxed">
            Keep all your drawing sets organized by project and revision. Easy to find,
            easy to manage, all in one place.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Bulk Download</h3>
          <p className="text-gray-600 leading-relaxed">
            Download entire drawing sets as ZIP files with properly renamed files.
            Perfect for submissions and distribution.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-xl shadow-md p-12 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create a Project</h3>
            <p className="text-gray-600">Set up your project with basic details and information.</p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Drawing Sets</h3>
            <p className="text-gray-600">Create revision sets and upload your Revit PDF exports.</p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Download & Share</h3>
            <p className="text-gray-600">Get perfectly renamed files, ready for submission.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl text-white shadow-xl">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 text-indigo-100">
          Start managing your drawings more efficiently today.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-indigo-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
        >
          View Your Projects
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>
    </div>
  )
}

export default Home
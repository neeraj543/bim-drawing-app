import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'

function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { t } = useLang()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="bg-amber-700 rounded-lg p-3">
              <img
                src="/LOGO-CLT-XPRT-WIT-RECHTHOOK-1-e1708081916795.png"
                alt="CLTXPRT Logo"
                className="h-24"
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t.home.pioneering}
          </h1>
          <p className="text-xl text-gray-700 mb-4 leading-relaxed font-medium">
            {t.home.buildingFuture}
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            CLTXPRT is one of Belgium's pioneers in CLT construction, the building technique of the future.
            With our in-depth specialization, we are your professional partner for design, engineering, and
            installation of Cross Laminated Timber projects in the Benelux.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
          >
            {t.home.getStarted}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Benefits Section - CLT Advantages */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">{t.home.whyClt}</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Cross Laminated Timber is not only an extremely reliable building material, but also much more
          environmentally friendly than traditional materials like concrete and steel.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ecological */}
          <div className="bg-white rounded-xl shadow-md p-8 border-2 border-green-100 hover:shadow-lg hover:border-green-200 transition-all">
            <div className="bg-green-100 rounded-lg p-3 w-fit mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.ecological}</h3>
            <p className="text-gray-600 leading-relaxed">
              Environmentally friendly alternative to concrete and steel. CLT stores CO₂ and reduces
              your carbon footprint significantly, making it the sustainable choice for our planet and future generations.
            </p>
          </div>

          {/* Reliable */}
          <div className="bg-white rounded-xl shadow-md p-8 border-2 border-blue-100 hover:shadow-lg hover:border-blue-200 transition-all">
            <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.reliable}</h3>
            <p className="text-gray-600 leading-relaxed">
              Exceptionally strong and durable building material with proven structural integrity. CLT offers
              superior strength-to-weight ratio and excellent seismic performance.
            </p>
          </div>

          {/* Energy Efficient */}
          <div className="bg-white rounded-xl shadow-md p-8 border-2 border-amber-100 hover:shadow-lg hover:border-amber-200 transition-all">
            <div className="bg-amber-100 rounded-lg p-3 w-fit mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.energyEfficient}</h3>
            <p className="text-gray-600 leading-relaxed">
              Superior insulation and thermal performance. Natural wood properties provide excellent energy
              efficiency, reducing heating and cooling costs throughout the building's lifecycle.
            </p>
          </div>

          {/* Speed */}
          <div className="bg-white rounded-xl shadow-md p-8 border-2 border-purple-100 hover:shadow-lg hover:border-purple-200 transition-all">
            <div className="bg-purple-100 rounded-lg p-3 w-fit mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.speed}</h3>
            <p className="text-gray-600 leading-relaxed">
              Faster construction times with prefabricated elements. CLT panels are manufactured off-site
              and assembled rapidly on location, dramatically reducing project timelines.
            </p>
          </div>

          {/* Precision */}
          <div className="bg-white rounded-xl shadow-md p-8 border-2 border-amber-100 hover:shadow-lg hover:border-amber-200 transition-all">
            <div className="bg-amber-100 rounded-lg p-3 w-fit mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.precision}</h3>
            <p className="text-gray-600 leading-relaxed">
              Accurate engineering and assembly down to the millimeter. Computer-controlled manufacturing
              ensures perfect dimensional accuracy and quality control.
            </p>
          </div>

          {/* Total Partner */}
          <div className="bg-white rounded-xl shadow-md p-8 border-2 border-orange-100 hover:shadow-lg hover:border-orange-200 transition-all">
            <div className="bg-orange-100 rounded-lg p-3 w-fit mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.totalPartner}</h3>
            <p className="text-gray-600 leading-relaxed">
              Complete support from design to installation. Our team handles engineering, fabrication,
              and on-site assembly, ensuring seamless project delivery from start to finish.
            </p>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-12 border border-amber-200">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">{t.home.buildingTomorrow}</h2>
        <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
          CLT construction will be indispensable in the future. At CLTXPRT, we are committed to realizing
          buildings that are truly beneficial for future generations and our planet. We combine traditional
          craftsmanship with cutting-edge technology to create sustainable, beautiful structures that stand
          the test of time.
        </p>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white shadow-xl">
        <h2 className="text-4xl font-bold mb-4">{t.home.readyToBuild}</h2>
        <p className="text-xl mb-8 text-amber-50">
          Join the sustainable building revolution. Manage your CLT projects with CLTXPRT.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-amber-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
        >
          Access Platform
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>
    </div>
  )
}

export default Home

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Go Home
          </Link>
          
          <Link
            href="/tracker"
            className="block w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-200 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Try HVAC Calculator
          </Link>
          
          <a
            href="mailto:hello@coilock.com"
            className="block text-blue-600 hover:text-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? We're here for you.</p>
        </div>
      </div>
    </div>
  );
}

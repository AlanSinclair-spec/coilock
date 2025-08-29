'use client';

const vendors = [
  { id: 1, name: 'ABC Construction', status: 'Compliant', daysRemaining: 45 },
  { id: 2, name: 'XYZ Logistics', status: 'Non-compliant', daysRemaining: 0 },
  { id: 3, name: 'Prime Electric', status: 'Compliant', daysRemaining: 120 },
];

export default function Dashboard() {
  const compliantPercentage = Math.round(
    (vendors.filter(v => v.status === 'Compliant').length / vendors.length) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button className="bg-[#2563eb] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Invite Vendor
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Vendor Compliance Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Vendor Compliance</h2>
            <div className="flex items-center">
              <div className="text-4xl font-bold mr-4">{compliantPercentage}%</div>
              <div className="text-gray-600">of vendors are compliant</div>
            </div>
          </div>

          {/* Industry Benchmark Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-400">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Industry Benchmark</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Your Requirement:</span>
                <span className="font-medium">$1,000,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Industry Median:</span>
                <span className="font-medium">$2,000,000</span>
              </div>
              <div className="mt-3 p-3 bg-amber-50 rounded-md">
                <p className="text-amber-800 text-sm">
                  Your coverage requirement is 50% below industry standard
                </p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-gray-600">Risk Score:</span>{' '}
                  <span className="font-medium text-red-600">HIGH</span>
                </div>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity">
                  See full risk report ($497)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blocking Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-blue-100 mb-1">Total Blocked</div>
            <div className="text-2xl font-bold">$2.3M</div>
            <div className="text-xs text-blue-100 opacity-80 mt-1">this month</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-sm font-medium text-gray-500 mb-1">Transactions Prevented</div>
            <div className="text-2xl font-bold text-gray-900">47</div>
            <div className="text-xs text-gray-500 mt-1">potential risks</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
            <div className="text-sm font-medium text-gray-500 mb-1">Audit Risk Avoided</div>
            <div className="text-2xl font-bold text-gray-900">$230K</div>
            <div className="text-xs text-amber-600 font-medium mt-1">10% of blocked amount</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-sm font-medium text-gray-500 mb-1">Compliance Rate</div>
            <div className="text-2xl font-bold text-gray-900">+34%</div>
            <div className="text-xs text-green-600 font-medium mt-1">vs last month</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vendor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vendor.status === 'Compliant' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vendor.daysRemaining > 0 ? `${vendor.daysRemaining} days` : 'Expired'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href={`/vendor/${vendor.id}/upload`} className="text-[#2563eb] hover:text-blue-700">
                        Upload COI
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

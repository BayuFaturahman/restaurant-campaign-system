import { useEffect, useState } from "react"

type Submission = {
  id: number
  name: string
  email: string
  phone: string
  createdAt?: string
  campaign?: {
    name: string
  }
}

export default function SubmissionsPage() {
  const [data, setData] = useState<Submission[]>([])

  useEffect(() => {
    fetch("/api/submissions/list")
      .then((res) => res.json())
      .then((result) => setData(result))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600">Admin Panel</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Form Submissions
            </h1>
            <p className="mt-2 text-gray-600">
              View leads submitted from campaign landing pages.
            </p>
          </div>

          <a
            href="/admin/campaigns"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Campaigns
          </a>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Campaign</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                      No submissions yet.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100">
                      <td className="px-6 py-4 text-sm text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{item.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{item.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {item.campaign?.name || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
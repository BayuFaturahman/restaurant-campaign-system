import { useEffect, useMemo, useState } from "react"
import axios from "axios"

type CampaignItem = {
  id: number
  name: string
  slug: string
  description: string
  status: string
}

export default function Campaigns() {
  const [campaign, setCampaign] = useState({
    name: "",
    slug: "",
    description: "",
    status: "Draft"
  })

  const [loading, setLoading] = useState(false)
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([])
  const [fetchingCampaigns, setFetchingCampaigns] = useState(true)
  const [search, setSearch] = useState("")

  const loadCampaigns = async () => {
    try {
      setFetchingCampaigns(true)
      const response = await fetch("/api/campaigns/list")
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error("Failed to load campaigns", error)
    } finally {
      setFetchingCampaigns(false)
    }
  }

  useEffect(() => {
    loadCampaigns()
  }, [])

  const filteredCampaigns = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    if (!keyword) return campaigns

    return campaigns.filter((item) => {
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.slug.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword)
      )
    })
  }, [campaigns, search])

  const submit = async () => {
    try {
      setLoading(true)

      await axios.post("/api/campaigns/create", campaign)

      alert("Campaign created successfully")

      setCampaign({
        name: "",
        slug: "",
        description: "",
        status: "Draft"
      })

      await loadCampaigns()
    } catch (error) {
      console.error(error)
      alert("Failed to create campaign")
    } finally {
      setLoading(false)
    }
  }

  const publishedCount = campaigns.filter(
    (item) => item.status === "Published"
  ).length

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-600">Admin Panel</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Campaign Management
            </h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Create restaurant marketing campaigns, manage landing pages,
              and review existing promotions from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Back to Home
            </a>
            <a
              href="/admin/submissions"
              className="rounded-xl bg-orange-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-700"
            >
              View Submissions
            </a>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Campaigns</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {campaigns.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Published</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {publishedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Draft</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {campaigns.length - publishedCount}
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Existing Campaigns
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Review and open campaign landing pages that have already been created.
                </p>
              </div>

              <div className="w-full lg:w-72">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search campaign..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500"
                />
              </div>
            </div>

            {fetchingCampaigns ? (
              <p className="text-sm text-gray-500">Loading campaigns...</p>
            ) : filteredCampaigns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
                {campaigns.length === 0
                  ? "No campaigns found yet. Create your first campaign from the form on the right."
                  : "No campaign matches your search."}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCampaigns.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-gray-200 p-5 transition hover:border-orange-200 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item.status === "Published"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                          /campaign/{item.slug}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          {item.description || "No description provided."}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`/campaign/${item.slug}`}
                          className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700"
                        >
                          View Page
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm xl:sticky xl:top-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Create Campaign
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the basic information for your new campaign.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Campaign Name
                </label>
                <input
                  value={campaign.name}
                  onChange={(e) =>
                    setCampaign({ ...campaign, name: e.target.value })
                  }
                  placeholder="Summer Food Festival"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  value={campaign.slug}
                  onChange={(e) =>
                    setCampaign({ ...campaign, slug: e.target.value })
                  }
                  placeholder="summer-food-festival"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={5}
                  value={campaign.description}
                  onChange={(e) =>
                    setCampaign({ ...campaign, description: e.target.value })
                  }
                  placeholder="Seasonal menu promotion with special dishes and limited-time offers."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={campaign.status}
                  onChange={(e) =>
                    setCampaign({ ...campaign, status: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <button
                onClick={submit}
                disabled={loading}
                className="w-full rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Saving..." : "Create Campaign"}
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-orange-50 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Recommended page structure
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>Hero section for headline and CTA</li>
                <li>Product section for featured menu items</li>
                <li>Form section for collecting customer leads</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { prisma } from "../../lib/prisma"
import { useState } from "react"

type CampaignPageProps = {
  campaign: {
    id: number
    name: string
    description: string
    slug: string
  } | null
}

export default function CampaignPage({ campaign }: CampaignPageProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  })

  const [loading, setLoading] = useState(false)

  if (!campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Campaign not found</h1>
          <p className="mt-2 text-gray-600">
            The campaign you are looking for does not exist.
          </p>
        </div>
      </div>
    )
  }

  const submitForm = async () => {
    try {
      setLoading(true)

      await fetch("/api/submissions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          campaignId: campaign.id
        })
      })

      alert("Your submission has been received")
      setForm({
        name: "",
        email: "",
        phone: ""
      })
    } catch (error) {
      alert("Failed to submit form")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white text-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-500 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
              Limited Time Restaurant Promo
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              {campaign.name}
            </h1>

            <p className="mt-5 text-lg leading-8 text-orange-50">
              {campaign.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#menu"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-orange-600"
              >
                Explore Menu
              </a>
              <a
                href="#contact"
                className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white"
              >
                Join Promo
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Featured Menu
          </p>
          <h2 className="mt-2 text-3xl font-bold">Special dishes in this campaign</h2>
          <p className="mt-3 text-gray-600">
            A sample product section to show how restaurant promotions can be presented.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Grilled Chicken Bowl",
              description: "Balanced meal with fresh vegetables and signature sauce."
            },
            {
              name: "Spicy Seafood Pasta",
              description: "A bold and flavorful menu choice for seafood lovers."
            },
            {
              name: "Tropical Mocktail",
              description: "Refreshing drink to complement the seasonal offer."
            }
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 h-40 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100" />
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="mt-3 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-gray-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Join the Promotion
            </p>
            <h2 className="mt-2 text-3xl font-bold">Get updates and exclusive offers</h2>
            <p className="mt-4 leading-7 text-gray-600">
              Leave your contact information and our team can reach out with more details
              about campaign offers, menu availability, or reservation updates.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <button
                onClick={submitForm}
                disabled={loading}
                className="w-full rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps({ params }: { params: { slug: string } }) {
  const campaign = await prisma.campaign.findUnique({
    where: {
      slug: params.slug
    }
  })

  return {
    props: {
      campaign
    }
  }
}
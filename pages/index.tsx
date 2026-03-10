import { prisma } from "../lib/prisma"

type HomeProps = {
    totalCampaigns: number
    publishedCampaigns: number
    totalSubmissions: number
    featuredCampaign: {
        name: string
        slug: string
        description: string
    } | null
}

export default function Home({
    totalCampaigns,
    publishedCampaigns,
    totalSubmissions,
    featuredCampaign
}: HomeProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl bg-white p-8 shadow-sm">
                        <span className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-700">
                            Restaurant Campaign Builder
                        </span>

                        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                            Create and manage restaurant promo pages from one simple dashboard
                        </h1>

                        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
                            This internal tool helps marketing teams create campaign pages,
                            publish promotional content, and collect customer leads without
                            relying on engineering support for every update.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                            <a
                                href="/admin/campaigns"
                                className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-700 active:scale-[0.98]"
                            >
                                Open Admin Panel
                            </a>

                            {featuredCampaign && (
                                <a
                                    href={`/campaign/${featuredCampaign.slug}`}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
                                >
                                    View Latest Campaign
                                </a>
                            )}

                        </div>

                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-gray-50 p-5">
                                <p className="text-sm text-gray-500">Total Campaigns</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {totalCampaigns}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-gray-50 p-5">
                                <p className="text-sm text-gray-500">Published</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {publishedCampaigns}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-gray-50 p-5">
                                <p className="text-sm text-gray-500">Submissions</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {totalSubmissions}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-8 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">
                                    Featured Campaign
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                                    {featuredCampaign ? featuredCampaign.name : "No published campaign yet"}
                                </h2>
                            </div>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                {featuredCampaign ? "Published" : "Empty"}
                            </span>
                        </div>

                        {featuredCampaign ? (
                            <>
                                <p className="mt-4 text-sm leading-7 text-gray-600">
                                    {featuredCampaign.description || "No description provided yet."}
                                </p>

                                <div className="mt-6 rounded-3xl bg-gradient-to-r from-orange-600 to-red-500 px-6 py-10 text-white">
                                    <p className="text-sm uppercase tracking-wide text-orange-100">
                                        Public Landing Page
                                    </p>
                                    <h3 className="mt-3 text-3xl font-bold">
                                        {featuredCampaign.name}
                                    </h3>
                                    <p className="mt-3 text-orange-50">
                                        Ready to be viewed by campaign visitors through the public URL.
                                    </p>
                                    <a
                                        href={`/campaign/${featuredCampaign.slug}`}
                                        className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-orange-600"
                                    >
                                        Open Campaign Page
                                    </a>
                                </div>

                                <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">Public URL</p>
                                    <p className="mt-2 break-all text-sm font-medium text-gray-800">
                                        /campaign/{featuredCampaign.slug}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                                Create a campaign and set its status to Published to show it here.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps() {
    const [totalCampaigns, publishedCampaigns, totalSubmissions, featuredCampaign] =
        await Promise.all([
            prisma.campaign.count(),
            prisma.campaign.count({
                where: {
                    status: "Published"
                }
            }),
            prisma.submission.count(),
            prisma.campaign.findFirst({
                where: {
                    status: "Published"
                },
                orderBy: {
                    id: "desc"
                },
                select: {
                    name: true,
                    slug: true,
                    description: true
                }
            })
        ])

    return {
        props: {
            totalCampaigns,
            publishedCampaigns,
            totalSubmissions,
            featuredCampaign
        }
    }
}
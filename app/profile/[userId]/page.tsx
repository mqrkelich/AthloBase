import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/helper/session"
import { getUserProfile } from "./_actions/user-profile"
import { UserProfileHeader } from "./_components/user-profile-header"
import { UserProfileStats } from "./_components/user-profile-stats"
import { UserProfileActivity } from "./_components/user-profile-activity"
import { UserProfileClubs } from "./_components/user-profile-clubs"
import { UserProfileAchievements } from "./_components/user-profile-achievements"
import Navbar from "@/app/(home)/_components/navbar"
import Footer from "@/app/(home)/_components/footer"
import MouseMoveEffect from "@/app/(home)/_components/mouse-move-effect"
import { getUserById } from "@/data/user"

interface UserProfilePageProps {
  params: {
    userId: string
  }
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
      const session = await getCurrentUser();
    const user = await getUserById(session?.id!);

  if (!user) {
    return notFound()
  }

  const dbUser = await getUserById(user.id)
  const profileData = await getUserProfile(params.userId, user.id)

  if (!profileData) {
    return notFound()
  }

  const isOwnProfile = user.id === params.userId

  return (
    <main className="overflow-auto">
      <Navbar
        user={
          dbUser
            ? {
                id: dbUser.id,
                name: dbUser.name ?? "Anonymous",
                image: dbUser.image ?? null,
              }
            : undefined
        }
      />

      <MouseMoveEffect />

      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black relative">
        <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
          {/* Profile Header */}
          <UserProfileHeader user={profileData.user} isOwnProfile={isOwnProfile} stats={profileData.stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Left Column - Stats and Achievements */}
            <div className="lg:col-span-1 space-y-6">
              <UserProfileStats stats={profileData.stats} />
              <UserProfileAchievements achievements={profileData.achievements} />
            </div>

            {/* Right Column - Activity and Clubs */}
            <div className="lg:col-span-2 space-y-6">
              <UserProfileClubs clubs={profileData.clubs} />
              <UserProfileActivity activities={profileData.recentActivity} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export default function InvitationPage() {
  const router = useRouter()
  const session = useSession()
  const invitationCode = router.query.invitationCode as string

  useEffect(() => {
    async function joinHouse() {
      if (!session) {
        // User is not authenticated, redirect to login page
        router.push('/login')
        return
      }

      // Call API route to join user to house using invitation code
      const response = await fetch(`/api/houses/${invitationCode}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        // Handle error
        console.error(`Error joining house: ${response.status} ${response.statusText}`)
        return
      }

      // User successfully joined house
      router.push('/houses')
    }

    joinHouse()
  }, [invitationCode, router, session])

  return null
}


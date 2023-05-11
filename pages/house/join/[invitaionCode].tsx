import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'

const InvitationPage = () => {
  const router = useRouter()
  const invitationCode = router.query.invitationCode as string

  useEffect(() => {
    async function joinHouse() {

      // Call API route to join user to house using invitation code
      const response = await fetch(`/api/houses/join/${invitationCode}`, {
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
  }, [invitationCode, router])

  return null
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);

  if (!session) {
    ctx.res.writeHead(302, { Location: `/auth?redirectUrl=${encodeURIComponent(ctx.req.url || '/')}` }).end();
  }

  return { props: {} };
};

export default InvitationPage

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { useAppVM } from '@/context/Contexts'
import { observer } from 'mobx-react-lite'
import React from 'react'

const InvitationPage = () => {
  const appVM = useAppVM();
  const router = useRouter()
  const invitationCode = router.query.invitationCode as string

  useEffect(() => {
    (async () => {
      // Call API route to join user to house using invitation code
      if (typeof window === "undefined") return
      const response = await fetch(`/api/houses/join/${invitationCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        // Handle error
        console.error(`Error joining house: ${response.status} ${response.statusText}`)
        return
      }
      // User successfully joined house
      router.push(`/house/${appVM.house?.id}`)
    })()
  }, [])

  return null
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);

  if (!session) {
    ctx.res.writeHead(302, { Location: `/auth?redirectUrl=${encodeURIComponent(ctx.req.url || '/')}` }).end();
  }

  return { props: {} };
};

export default React.memo(InvitationPage)

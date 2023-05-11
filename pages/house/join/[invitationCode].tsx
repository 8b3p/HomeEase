import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import prisma from '@/utils/PrismaClient'
import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { useAppVM } from '@/context/Contexts'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, LinearProgress } from '@mui/material'
import { Stack } from '@mui/system'

interface props {
  house: { name: string } | null
}

const InvitationPage = ({ house }: props) => {
  const appVM = useAppVM();
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const invitationCode = router.query.invitationCode as string;

  const joinHouse = async () => {
    // Call API route to join user to house using invitation code
    setLoading(true);
    const response = await fetch(`/api/houses/join/${invitationCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json();
    if (!response.ok) {
      // Handle error
      appVM.showAlert(data.error, 'error')
      return
    }
    // User successfully joined house
    const { users, ...house } = data.house
    appVM.house = house
    appVM.showAlert(`You have joined "${data.house.name}" house`, 'success')
    router.push(`/house/${appVM.house?.id}`)
  }

  useEffect(() => {
    if (!house) {
      appVM.showAlert('Invalid invitaion link', 'error')
      router.push('/')
    }
  }, [house, appVM, router])

  return (
    <Stack height='100%' alignItems='center' justifyContent="center">
      {loading ? (
        <LinearProgress sx={{
          width: '60%',
          minWidth: '200px'
        }} />
      ) : (
        <Button onClick={joinHouse} size="large" sx={{fontSize: '1.5rem'}}>Join &quot;{house?.name}&quot; ?</Button>
      )}
    </Stack>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);
  const invitationCode = ctx.query.invitationCode as string;

  if (!session) {
    ctx.res.writeHead(302, { Location: `/auth?redirectUrl=${encodeURIComponent(ctx.req.url || '/')}` }).end();
  }

  const house = await prisma.house.findUnique({
    where: {
      invitationCode
    },
    select: {
      name: true
    }
  })


  return { props: { house } };
};

export default observer(InvitationPage)

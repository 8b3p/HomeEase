import { Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import { Payment, User } from "@prisma/client";
import { Session } from "next-auth";
import { useMemo } from "react";
import DashText from "@/components/UI/DashText";
import PaymentItem from "@/components/payments/paymentsList/PaymentItem";

interface props {
  payments: Payment[]
  users: Partial<User>[];
  session: Session;
}

const PaymentsList = ({ payments, users, session }: props) => {
  const outgoing = useMemo(() => {
    return (payments.length > 0 ? payments.filter(payment => payment.payerId === session.user?.id) : [])
  }, [payments, session.user?.id])
  const incoming = useMemo(() => {
    return (payments.length > 0 ? payments.filter(payment => payment.recipientId === session.user?.id) : [])
  }, [payments, session.user?.id])
  const isMobile = useMediaQuery('(max-width: 600px)')


  return (
    <Stack
      justifyContent='center'
      alignItems='start'
      width='100%'
      spacing={2}
    >
      <Stack
        width='100%'
        spacing={1}
        paddingBottom="2rem"
      >
        <DashText title={"Outgoing " + payments.filter(payment => payment.status === "Pending").reduce((acc, payment) => (payment.payerId === session.user.id ? acc += payment.amount : acc), 0)} maxWidth={1000} />
        <Stack
          width="100%"
          direction={isMobile ? "column" : "row"}
          sx={theme => ({
            boxShadow: theme.shadows[3],
            borderRadius: theme.shape.borderRadius
          })}
        >
          <Stack width={isMobile ? "100%" : "50%"} padding={2}>
            {outgoing.filter(p => p.status === "Pending").length === 0 ? (
              <Stack height="100%" width="100%" justifyContent="center" alignItems="center"><Typography variant="h6">No Pending Payments</Typography></Stack>
            ) : (
              outgoing.filter(p => p.status === "Pending").map((payment) => {
                return (
                  <PaymentItem
                    key={payment.id}
                    paymentId={payment.id}
                    amount={payment.amount}
                    description={payment.description}
                    user={users.find(user => user.id === payment.recipientId)!}
                    session={session}
                    type="OutgoingPending"
                  />
                );
              })
            )}
          </Stack>
          <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />
          <Stack width={isMobile ? "100%" : "50%"} padding={2}>
            {outgoing.filter(p => (p.status === "Completed" || p.status === "Cancelled")).length === 0 ? (
              <Stack height="100%" width="100%" justifyContent="center" alignItems="center" ><Typography variant="h6">No Completed Payments</Typography></Stack>
            ) : (
              <>
                {outgoing.filter(p => p.status === "Completed").map((payment) => (
                  <PaymentItem
                    key={payment.id}
                    paymentId={payment.id}
                    amount={payment.amount}
                    description={payment.description}
                    user={users.find(user => user.id === payment.recipientId)!}
                    session={session}
                    type="Complete"
                  />
                ))}
                {outgoing.filter(p => p.status === "Cancelled").map((payment) => {
                  return (
                    <PaymentItem
                      key={payment.id}
                      paymentId={payment.id}
                      amount={payment.amount}
                      description={payment.description}
                      user={users.find(user => user.id === payment.recipientId)!}
                      session={session}
                      type="Cancelled"
                    />
                  )
                })}
              </>
            )}
          </Stack>
        </Stack >
      </Stack >
      <Stack
        width='100%'
        spacing={1}
        paddingBottom="2rem"
      >
        <DashText title={"Incoming " + payments.reduce((acc, payment) => (payment.recipientId === session.user.id ? acc += payment.amount : acc), 0)} maxWidth={1000} />
        <Stack
          width="100%"
          direction={isMobile ? "column" : "row"}
          sx={theme => ({
            boxShadow: theme.shadows[3],
            borderRadius: theme.shape.borderRadius
          })}
        >
          <Stack width={isMobile ? "100%" : "50%"} padding={2}>
            {incoming.filter(p => p.status === "Pending").length === 0 ? (
              <Stack height="100%" width="100%" justifyContent="center" alignItems="center" ><Typography variant="h6">No Pending Payments</Typography></Stack>
            ) : (
              incoming.filter(p => p.status === "Pending").map((payment) => {
                return (
                  <PaymentItem
                    key={payment.id}
                    paymentId={payment.id}
                    amount={payment.amount}
                    description={payment.description}
                    user={users.find(user => user.id === payment.payerId)!}
                    session={session}
                    type="IncomingPending"
                  />
                )
              })
            )}
          </Stack>
          <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />
          <Stack width={isMobile ? "100%" : "50%"} padding={2}>
            {incoming.filter(p => p.status === "Completed").length === 0 ? (
              <Stack height="100%" width="100%" justifyContent="center" alignItems="center" ><Typography variant="h6">No Completed Payments</Typography></Stack>
            ) : (
              <>
                {incoming.filter(p => p.status === "Completed").map((payment) => {
                  return (
                    <PaymentItem
                      key={payment.id}
                      paymentId={payment.id}
                      amount={payment.amount}
                      description={payment.description}
                      user={users.find(user => user.id === payment.payerId)!}
                      session={session}
                      type="Complete"
                    />
                  )
                })}
                {incoming.filter(p => p.status === "Cancelled").map((payment) => {
                  return (
                    <PaymentItem
                      key={payment.id}
                      paymentId={payment.id}
                      amount={payment.amount}
                      description={payment.description}
                      user={users.find(user => user.id === payment.payerId)!}
                      session={session}
                      type="Cancelled"
                    />
                  )
                })}
              </>
            )}
          </Stack >
        </Stack >
      </Stack >
    </Stack >
  )
}

export default PaymentsList;

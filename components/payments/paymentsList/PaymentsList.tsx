import { Divider, Stack, Typography, useMediaQuery, useTheme, } from "@mui/material";
import { Payment, User } from "@prisma/client";
import { Session } from "next-auth";
import { useMemo } from "react";
import DashText from "@components/UI/DashText";
import PaymentItem from "./PaymentItem";
import AppVM from "@context/appVM";

interface Props { payments: Payment[]; users: User[]; session: Session; }

const PaymentsList = ({ payments, users, session }: Props) => {
  const isTablet = useMediaQuery("(max-width: 960px)");
  const theme = useTheme();

  // Separate payments into outgoing and incoming
  const outgoing = useMemo(() => {
    return payments.filter(payment => payment.payerId === session.user?.id);
  }, [payments, session.user?.id]);

  const incoming = useMemo(() => {
    return payments.filter(payment => payment.recipientId === session.user?.id);
  }, [payments, session.user?.id]);

  // Calculate total amounts (optional)
  const outgoingTotal = outgoing.reduce(
    (acc, payment) => acc + payment.amount,
    0
  );
  const incomingTotal = incoming.reduce(
    (acc, payment) => acc + payment.amount,
    0
  );

  return (
    <Stack justifyContent='center' alignItems='start' width='100%' spacing={4}>
      <Stack width='100%' spacing={4} paddingBottom='2rem' direction={isTablet ? "column" : "row"} >
        {/* Outgoing Payments */}
        <Stack width={isTablet ? "100%" : "50%"} spacing={2}>
          <DashText title={`Outgoing ${AppVM.currency}${outgoingTotal}`} />
          <Stack padding={2} sx={{ boxShadow: theme.shadows[3], borderRadius: theme.shape.borderRadius, backgroundColor: theme.palette.background.paper, }} >
            {outgoing.length === 0 ? (
              <Stack height='100%' width='100%' justifyContent='center' alignItems='center' >
                {" "}
                <Typography variant='h6'>No Outgoing Payments</Typography>{" "}
              </Stack>
            ) : (
              outgoing.map(payment => {
                const recipient = users.find(user => user.id === payment.recipientId);
                return (
                  <PaymentItem
                    key={payment.id}
                    paymentId={payment.id}
                    amount={payment.amount}
                    description={payment.description}
                    direction='Outgoing'
                    status={payment.status}
                    isLast={outgoing.indexOf(payment) === outgoing.length - 1}
                    user={recipient!}
                    date={payment.createdAt}
                    session={session}
                    redirectPath='/payments'
                  />
                );
              })
            )}
          </Stack>
        </Stack>

        {/* Divider between columns on larger screens */}
        {!isTablet && <Divider orientation='vertical' flexItem />}

        {/* Incoming Payments */}
        <Stack width={isTablet ? "100%" : "50%"} spacing={2}>
          <DashText title={`Incoming ${AppVM.currency}${incomingTotal}`} />
          <Stack padding={2} sx={{ boxShadow: theme.shadows[3], borderRadius: theme.shape.borderRadius, backgroundColor: theme.palette.background.paper, }} >
            {incoming.length === 0 ? (
              <Stack height='100%' width='100%' justifyContent='center' alignItems='center' >
                <Typography variant='h6'>No Incoming Payments</Typography>
              </Stack>
            ) : (
              incoming.map(payment => {
                const payer = users.find(user => user.id === payment.payerId);
                return (
                  <PaymentItem
                    key={payment.id}
                    paymentId={payment.id}
                    amount={payment.amount}
                    description={payment.description}
                    direction='Incoming'
                    status={payment.status}
                    isLast={incoming.indexOf(payment) === incoming.length - 1}
                    date={payment.createdAt}
                    user={payer!}
                    session={session}
                    redirectPath='/payments'
                  />
                );
              })
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PaymentsList;

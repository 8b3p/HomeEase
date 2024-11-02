import { Grow, Stack } from "@mui/material";
import prisma from "@utils/PrismaClient";
import { Payment, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import PaymentOptions from "@components/DateOptions";
import CreatePaymentForm from "@components/payments/CreatePaymentForm";

interface props {
  payments: Payment[];
  session: Session;
  users: User[];
}

const Payments = ({ payments, session, users }: props) => (
  <Grow in={true}>
    <Stack
      justifyContent='start'
      alignItems='center'
      height='100%'
      padding='2rem 0'
      margin='auto'
      width='95%'
      gap={4}
    >
      <PaymentOptions
        users={users}
        payments={payments}
        session={session}
        addButton={
          <CreatePaymentForm
            session={session}
            users={users}
            houseId={session.user.houseId || ""}
          />
        }
      />
    </Stack>
  </Grow>
);

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);
  if (!session)
    return {
      props: {},
      redirect: {
        destination: `/auth?redirectUrl=${encodeURIComponent(ctx.resolvedUrl)}`,
      },
    };
  if (!session?.user?.houseId)
    return { props: {}, redirect: { destination: `/profile` } };
  const [payments, houseUsers] = await Promise.all([
    prisma.payment.findMany({
      where: {
        OR: [
          { payerId: session?.user?.id },
          { recipientId: session?.user?.id },
        ],
      },
    }),
    prisma.user.findMany({
      where: { houseId: session?.user?.houseId },
      select: { id: true, firstName: true, lastName: true, email: true },
    }),
  ]);
  const serializablePayments = payments.map(payment => {
    return {
      ...payment,
      createdAt: payment.createdAt.toString(),
      updatedAt: payment.updatedAt.toString(),
    };
  });

  return {
    props: {
      session: session,
      users: houseUsers,
      payments: serializablePayments,
    },
  };
};

export default Payments;

import type { GetServerSideProps, NextPage } from "next";
import { Avatar, AvatarGroup, Button, Grid, Grow, Paper, Stack, Theme, Typography, useMediaQuery } from "@mui/material";
import { stringAvatar } from "@components/layout/Navbar/NavbarMenu";
import { observer } from "mobx-react-lite";
import { getSession } from "next-auth/react";
import { Chore, ChoreAssignment, House, Payment, User } from "@prisma/client";
import prisma from "@/utils/PrismaClient";
import { Session } from "next-auth";
import NoHouse from "@/components/house/NoHouse";
import { useRouter } from "next/router";
import { useThemeVM } from "@/context/Contexts";
import AssignmentItem from "@/components/chores/choresList/AssignmentItem";
import PaymentItem from "@/components/payments/paymentsList/PaymentItem";
import DashText from "@/components/UI/DashText";

interface props {
  session: Session;
  house: (House & {
    choreAssignments: (ChoreAssignment & {
      Chore: Chore;
    })[];
    users: User[];
    payments: Payment[];
  }) | null;
}

const Home: NextPage<props> = ({ house, session }) => {
  const themeVM = useThemeVM();
  const router = useRouter();
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  if (!session) {
    //create a nice welcome page for visitors
    return (
      <Grow in={true}>
        <Stack minHeight="70%" justifyContent="center" alignItems="center" spacing={4}>
          <Typography variant={isSmallScreen ? "h3" : 'h3'} textAlign="center">
            Welcome to HomeEase
          </Typography>
          <Typography variant={isSmallScreen ? "h5" : 'h4'} textAlign="center">
            Where you can manage your house with ease
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => { router.push('/auth') }} >
            Sign in to get started
          </Button>
        </Stack >
      </Grow>
    )
  }
  if (!house) {
    return (
      <Grow in={true}>
        <Stack minHeight="100%" justifyContent="center" alignItems="center" >
          <Typography variant={isSmallScreen ? "h5" : 'h4'} textAlign="center">
            Not part of a house yet?
          </Typography>
          <NoHouse title={false} />
        </Stack >
      </Grow>
    )
  }

  return (
    <Grow in={true}>
      <Grid container spacing={2} paddingTop={4} paddingBottom={4}>
        <Grid item xs={12}>
          <Stack justifyContent="center" alignItems="center" >
            <Paper
              sx={(theme) => ({
                minWidth: "100%",
                boxShadow: theme.shadows[5],
                padding: theme.spacing(2),
                borderRadius: theme.shape.borderRadius,
              })}
            >
              <Stack direction={isSmallScreen ? "column" : "row"} justifyContent="space-between" alignItems={isSmallScreen ? "start" : "center"} spacing={2}>
                <Typography variant="h4" color={theme => theme.palette.secondary.main}>
                  Member of &#39;{house.name}&#39;
                </Typography>
                <AvatarGroup max={4} sx={{ cursor: 'pointer' }} onClick={() => router.push('profile')}>
                  {house.users.map((user) => (
                    <Avatar
                      {...stringAvatar(user.firstName + " " + user.lastName, themeVM.themeType)}
                      key={user.id}

                    />
                  ))}
                </AvatarGroup>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack justifyContent="center" alignItems="center" spacing={1}>
            <Typography variant="h4" textAlign="center" color={theme => theme.palette.secondary.main}>
              Chores
            </Typography>
            <Paper
              sx={(theme) => ({
                minWidth: "100%",
                boxShadow: theme.shadows[5],
                padding: theme.spacing(2),
                borderRadius: theme.shape.borderRadius,
              })}
            >
              {house.choreAssignments.length > 0 ? (
                house.choreAssignments.map((choreAssignment) => (
                  <AssignmentItem
                    key={choreAssignment.id}
                    chore={choreAssignment.Chore}
                    firstname={house.users.find(user => user.id === session.user.id)?.firstName!}
                    lastname={house.users.find(user => user.id === session.user.id)?.lastName!}
                    assignmentId={choreAssignment.id}
                    item="MinePending"
                    session={session}
                  />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No pending chores
                </Typography>
              )}
            </Paper>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack justifyContent="center" alignItems="center" spacing={1}>
            <Typography variant="h4" textAlign="center" color={theme => theme.palette.secondary.main}>
              Payments
            </Typography>
            <Paper
              sx={(theme) => ({
                minWidth: "100%",
                boxShadow: theme.shadows[5],
                padding: theme.spacing(2),
                borderRadius: theme.shape.borderRadius,
              })}
            >
              {house.payments.length > 0 ? (
                <>
                  {house.payments.filter(payment => payment.recipientId === session.user.id).length > 0 && (
                    <DashText
                      title={"Incoming " + house.payments.filter(payment => payment.recipientId === session.user.id).reduce((a, b) => a + b.amount, 0).toFixed(2)}
                      maxWidth={100} />
                  )}
                  {house.payments.filter(payment => payment.recipientId === session.user.id).map((payment) => (
                    <PaymentItem
                      key={payment.id}
                      amount={payment.amount}
                      description={payment.description}
                      user={house.users.find(user => user.id === payment.recipientId)!}
                      paymentId={payment.id}
                      type="IncomingPending"
                      session={session}
                    />
                  ))}
                  {house.payments.filter(payment => payment.payerId === session.user.id).length > 0 && (
                    <DashText
                      title={"Outgoing " + house.payments.filter(payment => payment.payerId === session.user.id).reduce((a, b) => a + b.amount, 0).toFixed(2)}
                      maxWidth={1000} />
                  )}
                  {house.payments.filter(payment => payment.payerId === session.user.id).map((payment) => (
                    <PaymentItem
                      key={payment.id}
                      amount={payment.amount}
                      description={payment.description}
                      user={house.users.find(user => user.id === payment.recipientId)!}
                      paymentId={payment.id}
                      type="OutgoingPending"
                      session={session}
                    />
                  ))}
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No Unpayed Payments
                </Typography>
              )}
            </Paper>
          </Stack>
        </Grid>
      </Grid >
    </Grow >
  );
};


export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);

  let house: (House & {
    choreAssignments: (ChoreAssignment & {
      Chore: Chore;
    })[];
    users: User[];
    payments: Payment[];
  }) | null;
  if (session?.user?.houseId) {
    house = await prisma.house.findUnique({
      where: {
        id: session?.user?.houseId,
      },
      include: {
        users: true,
        choreAssignments: {
          include: {
            Chore: true
          }
        },
        payments: true,
      },
    });
    if (!house) {
      return {
        props: {
          session: session,
          house: null,
        },
      }
    }
    house.payments = house.payments.filter(payment => (payment.payerId === session?.user?.id || payment.recipientId === session?.user?.id) && payment.status === "Pending");
    house.choreAssignments = house.choreAssignments.filter(assignment => assignment.userId === session?.user?.id && assignment.status === "Pending");
    const serializableHouse = JSON.parse(JSON.stringify(house));
    return {
      props: {
        session: session,
        house: serializableHouse,
      },
    };
  }
  return {
    props: {
      session: session,
      house: null,
    },
  }
};

export default observer(Home);

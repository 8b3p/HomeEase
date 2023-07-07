import type { GetServerSideProps, NextPage } from "next";
import { Avatar, AvatarGroup, Button, Divider, Grid, Grow, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Theme, Tooltip, Typography, useMediaQuery } from "@mui/material";
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
import { InfoOutlined } from "@mui/icons-material";

interface props {
  session: Session;
  house: (House & {
    choreAssignments: (ChoreAssignment & {
      Chore: Chore;
    })[];
    users: User[];
    payments: Payment[];
  }) | null;
  balances: { [key: string]: { amount: number, owe: boolean } };
}

const Home: NextPage<props> = ({ house, session, balances }) => {
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
                borderRadius: theme.shape.borderRadius,
              })}
            >
              <Stack justifyContent="center" alignItems="start" spacing={2} padding={2}>
                {house.choreAssignments.length > 0 ? (
                  house.choreAssignments.map((choreAssignment) => (
                    <AssignmentItem
                      key={choreAssignment.id}
                      chore={choreAssignment.Chore}
                      firstname={house.users.find(user => user.id === session.user.id)?.firstName!}
                      lastname={house.users.find(user => user.id === session.user.id)?.lastName!}
                      assignmentId={choreAssignment.id}
                      item="MinePending"
                      redirectPath="/"
                      coloredAvatar={true}
                      session={session}
                    />
                  ))
                ) : (
                  <Stack justifyContent="center" alignItems="center" width="100%">
                    <Typography variant="body1" color="text.secondary">
                      No pending chores
                    </Typography>
                  </Stack>
                )}
                <Divider flexItem />
                <Button variant="outlined" color="info" size="small" onClick={() => router.push(`/chores${house.choreAssignments.length > 0 ? "?d=" + house.choreAssignments.sort((a, b) => {
                  //sort the payments by date
                  return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
                })[house.choreAssignments.length - 1].dueDate.toString().split("T")[0] : ""}`)}>Details</Button>
              </Stack>
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
                borderRadius: theme.shape.borderRadius,
              })}
            >
              <Stack justifyContent="center" alignItems="start" spacing={2} padding={2}>
                <Stack justifyContent="center" alignItems="start">
                  <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                    <Typography variant="h4" textAlign="center">Summary</Typography>
                    <Tooltip title="This is the summary of all the pending payments together">
                      <InfoOutlined color="disabled" fontSize="small" />
                    </Tooltip>
                  </Stack>
                  {house.users.filter(user => user.id !== session.user.id).map((user) => (
                    <ListItem alignItems="flex-start" disablePadding key={user.id}>
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp"
                          {...stringAvatar(user.firstName + " " + user.lastName, themeVM.themeType)}
                        ></Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        sx={(theme) => ({ textTransform: 'capitalize', color: balances[user.id]?.owe ? theme.palette.error.light : theme.palette.success.main })}
                        primary={"$" + balances[user.id].amount}
                        secondary={
                          <Typography
                            sx={{ display: 'inline', textTransform: 'capitalize' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {balances[user.id]?.owe ? `You owe ${user.firstName} ${user.lastName}` : `${user.firstName} ${user.lastName} owes you`}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </Stack>
                <Divider flexItem />
                <Button variant="outlined" color="info" size="small" onClick={() => router.push(`/payments${house.payments.length > 0 ? "?d=" + house.payments.sort((a, b) => {
                  //sort the payments by date
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })[house.payments.length - 1].createdAt.toString().split("T")[0] : ""}`)}>Details</Button>
              </Stack>
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
        balances: calculateBalance(house, session?.user?.id)
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

//create this function to calculate weather i owe money to each user or they owe money to me, and how much 
//so an object of the amount and weather i owe or they owe
//the payment object holds the amount and the payer and recipient
const calculateBalance = (
  house: House & {
    choreAssignments: (ChoreAssignment & {
      Chore: Chore;
    })[];
    users: User[];
    payments: Payment[];
  },
  currentUser: string
) => {
  const outgoing: { [key: string]: number } = {};
  const incoming: { [key: string]: number } = {};
  house.payments.forEach(payment => {
    if (payment.payerId === currentUser) {
      if (outgoing[payment.recipientId]) {
        outgoing[payment.recipientId] += payment.amount;
      } else {
        outgoing[payment.recipientId] = payment.amount
      }
    }
    if (payment.recipientId === currentUser) {
      if (incoming[payment.payerId]) {
        incoming[payment.payerId] += payment.amount;
      } else {
        incoming[payment.payerId] = payment.amount
      }
    }
  });
  const balance: { [key: string]: { amount: number, owe: boolean } } = {};
  house.users.forEach(user => {
    const amount = (incoming[user.id] || 0) - (outgoing[user.id] || 0);
    balance[user.id] = {
      amount: amount,
      owe: amount < 0
    }
  });
  return balance;
}

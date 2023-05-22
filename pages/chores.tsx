import { Badge, Box, Divider, IconButton, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/utils/PrismaClient";
import { Chore, ChoreAssignment, Status, User } from "@prisma/client";
import CreateChoreForm from "@/components/chores/CreateChoreForm";
import AssignChoreForm from "@/components/chores/AssignChoreForm";
import { Session } from "next-auth";
import { ArrowRight, ArrowLeft, Check, Circle } from "@mui/icons-material";
import { useRouter } from "next/router";
import { ChoreAssignmentIdPutBody } from "./api/houses/[houseId]/chores/assignment/[choreAssignmentId]";
import { useAppVM } from "@/context/Contexts";
import Grid from "@mui/material/Unstable_Grid2";
import styled from "@mui/styled-engine";
import { useEffect, useState } from "react";

interface Props {
  chores: Chore[];
  choreAssignments: ChoreAssignment[];
  users: Partial<User>[];
  session: Session;
}

const daysInterval = 5;

const Item = styled(Paper)(({ theme }: any) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  position: "relative",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: '100%',
}));

const groupByDay = (chores: ChoreAssignment[]) => {
  const grouped = chores.reduce((acc, chore) => {
    const dateString = new Date(chore.dueDate).toLocaleDateString(undefined, { day: "numeric", month: 'long', year: 'numeric' });
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(chore);
    return acc;
  }, {} as { [key: string]: ChoreAssignment[] });
  return grouped;
}

const Chores = ({ chores, choreAssignments, users, session }: Props) => {
  const router = useRouter();
  const appVM = useAppVM();
  const [byDay, setByDay] = useState<{ [key: string]: ChoreAssignment[] } | undefined>();
  const isMobile = useMediaQuery('(max-width: 600px)')
  const currentDate = new Date(); // Get the current date
  const start = new Date(currentDate); // Create a new date object for the start date
  start.setDate(currentDate.getDate() - 1); // Set the start date to yesterday
  const [startDate, setStartDate] = useState<Date>(start)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    setByDay(groupByDay(choreAssignments))
  }, [choreAssignments])

  const markChoreDone = async (id: string) => {
    const body: ChoreAssignmentIdPutBody = {
      status: Status.Completed
    }

    try {
      // Make a POST request to the API endpoint to create the chore
      const res = await fetch(`/api/houses/${session.user.houseId}/chores/assignment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      const data = await res.json();
      if (!res.ok) {
        appVM.showAlert(data.message, 'error')
      }

      appVM.showAlert('Assignment Completed', "success")
      // Reset the form fields and close the create panel
    } catch (e: any) {
      appVM.showAlert(e.message, 'error')
    }
    router.push('/chores')
  };

  const handleDayJump = (day: number) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    const date = new Date();
    date.setTime(startDate.getTime() + (day * msPerDay))
    setSelectedDate(date)
    setStartDate(date)
  }

  return (
    <Stack
      justifyContent='start'
      alignItems='center'
      height='100%'
      margin="auto"
      width='90%'
    >
      <Stack direction="row" width="100%" padding="0.5rem 0" justifyContent="space-between">
        <Stack direction="row">
          <IconButton onClick={() => handleDayJump(-daysInterval)}><ArrowLeft /></IconButton>
          <IconButton onClick={() => handleDayJump(daysInterval)}><ArrowRight /></IconButton>
          <Stack justifyContent="center" alignItems="center">
            {selectedDate.toLocaleString('default', { weekday: 'short' })}, {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getDate()}
          </Stack>
        </Stack>
        <AssignChoreForm
          houseId={session.user.houseId || ""}
          defaultDate={selectedDate}
          chores={chores}
          users={users}
        />
      </Stack>
      <Grid container columns={daysInterval} height="3rem" width="100%">
        {new Array(daysInterval).fill(0).map((_, i) => {
          const date = new Date();
          const msPerDay = 1000 * 60 * 60 * 24;
          date.setTime(startDate.getTime() + (i * msPerDay))
          const dateString = date.toLocaleString(undefined, { day: "numeric", month: 'long', year: 'numeric' });
          const day = date.getDate();
          const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
          return (
            <Grid xs={1} key={i}>
              <Item onClick={() => { setSelectedDate(date) }} sx={selectedDate.getDate() === date.getDate() ? { color: 'primary.main' } : {}}>
                <Typography variant='h6'>{isMobile ? '' : dayOfWeek} {day}</Typography>
                {byDay && byDay[dateString] && byDay[dateString].length > 0 ?
                  <Circle
                    sx={{
                      position: 'absolute',
                      fontSize: '6px',
                      top: '80%'
                    }}
                    color={byDay[dateString].find(chore => chore.status === "Pending") ? "info" : "disabled"}
                  /> : ''}
              </Item>
            </Grid>
          )
        })}
      </Grid>
      {
        (byDay &&
          byDay[selectedDate.toLocaleString(undefined, { day: "numeric", month: "long", year: "numeric" })] &&
          byDay[selectedDate.toLocaleString(undefined, { day: "numeric", month: "long", year: "numeric" })].length > 0) &&
        byDay[selectedDate.toLocaleString(undefined, { day: "numeric", month: "long", year: "numeric" })].map((choreAssignment, i) => {
          return (
            <p key={i}>
              {chores.find(chore => chore.id === choreAssignment.choreId)?.title} {users.find(user => user.id === choreAssignment.userId)?.firstName}
            </p>
          )
        })
      }
    </Stack >
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      props: {},
      redirect: {
        destination: `/auth?redirectUrl=${encodeURIComponent(
          ctx.req.url || "/"
        )}`,
      },
    };
  }
  if (!session?.user?.houseId) {
    return {
      props: {},
      redirect: {
        destination: `/house`,
      },
    };
  }
  const [chores, choreAssignments, houseUsers] = await Promise.all([
    prisma.chore.findMany({
      where: { OR: [{ owner: session?.user?.houseId }, { owner: null }] },
    }),
    prisma.choreAssignment.findMany({
      where: { houseId: session?.user?.houseId },
    }),
    prisma.user.findMany({
      where: {
        houseId: session?.user?.houseId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    }),
  ]);
  const serializableChore = chores.map(chore => {
    return {
      ...chore,
      createdAt: chore.createdAt.toString(),
      updatedAt: chore.updatedAt.toString(),
    };
  });
  const serializableChoreAssignment = choreAssignments.map(assignment => {
    return {
      ...assignment,
      createdAt: assignment.createdAt.toString(),
      updatedAt: assignment.updatedAt.toString(),
      dueDate: assignment.dueDate.toString(),
    };
  });
  return {
    props: {
      chores: serializableChore,
      choreAssignments: serializableChoreAssignment,
      users: houseUsers,
      session: session,
    },
  };
};

export default Chores;







      // <AssignChoreForm
      //   houseId={session.user.houseId || ""}
      //   chores={chores}
      //   users={users}
      // />
      // <CreateChoreForm houseId={session.user.houseId || ""} />
      //
      // <Typography variant='h5'>Chore Assignments</Typography>
      // <Stack
      //   divider={<Divider flexItem orientation='vertical' />}
      //   direction={isMobile ? 'column' : 'row'}
      //   spacing={2}
      // >
      //   <Stack
      //     direction="column"
      //     divider={<Divider flexItem orientation='horizontal' />}
      //     alignItems="center"
      //     spacing={1}
      //   >
      //     <Typography variant="h4">Pending</Typography>
      //     {choreAssignments.map(assignment => {
      //       if (assignment.status === "Pending") {
      //         return (
      //           <Stack
      //             key={assignment.id}
      //             direction='row'
      //             divider={<Divider flexItem orientation='vertical' />}
      //             alignItems="center"
      //             spacing={2}
      //           >
      //             <Typography variant='body1'>
      //               {users.find(user => user.id === assignment.userId)?.firstName}{" "}
      //               {users.find(user => user.id === assignment.userId)?.lastName}
      //             </Typography>
      //             <Typography variant='body1'>
      //               {chores.find(chore => chore.id === assignment.choreId)?.title}
      //             </Typography>
      //             {assignment.userId === session.user.id && (
      //               < IconButton onClick={() => { markChoreDone(assignment.id) }}>
      //                 <Check fontSize="small" />
      //               </IconButton>
      //             )}
      //           </Stack>
      //         )
      //       }
      //     })}
      //   </Stack>
      //   <Stack
      //     direction="column"
      //     divider={<Divider flexItem orientation='horizontal' />}
      //     alignItems="center"
      //     spacing={1}
      //   >
      //     <Typography variant="h4">Completed</Typography>
      //     {choreAssignments.map(assignment => {
      //       if (assignment.status === "Completed") {
      //         return (
      //           <Stack
      //             key={assignment.id}
      //             direction='row'
      //             divider={<Divider flexItem orientation='vertical' />}
      //             alignItems="center"
      //             spacing={2}
      //           >
      //             <Typography variant='body1'>
      //               {users.find(user => user.id === assignment.userId)?.firstName}{" "}
      //               {users.find(user => user.id === assignment.userId)?.lastName}
      //             </Typography>
      //             <Typography variant='body1'>
      //               {chores.find(chore => chore.id === assignment.choreId)?.title}
      //             </Typography>
      //           </Stack>
      //         )
      //       }
      //     })}
      //   </Stack>
      // </Stack>

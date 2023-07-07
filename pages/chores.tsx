import { Grow, Stack, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/utils/PrismaClient";
import { Chore, ChoreAssignment, User } from "@prisma/client";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import ChoreOptions from "@/components/DateOptions";
import ChoresList from "@/components/chores/choresList/ChoresList";
import AssignChoreForm from "@/components/chores/AssignChoreForm";

interface Props {
  chores: Chore[];
  choreAssignments: ChoreAssignment[];
  users: Partial<User>[];
  session: Session;
  initDate: string;
}

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

const Chores = ({ chores, choreAssignments, users, session, initDate }: Props) => {
  const [byDay, setByDay] = useState<{ [key: string]: ChoreAssignment[] } | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(initDate))

  useEffect(() => {
    setByDay(groupByDay(choreAssignments))
  }, [choreAssignments])

  return (
    <Grow in={true}>
      <Stack
        justifyContent='start'
        alignItems='center'
        height='100%'
        padding="2rem 0"
        margin="auto"
        width='95%'
        gap={4}
      >
        <ChoreOptions
          byDay={byDay}
          setSelected={setSelectedDate}
          selected={selectedDate}
          session={session}
          addButton={
            <AssignChoreForm
              variant="outlined"
              houseId={session.user.houseId || ""}
              defaultDate={selectedDate}
              chores={chores ? chores : []}
              users={users ? users : []}
            />
          }
        />
        {byDay && (
          byDay[selectedDate.toLocaleString(undefined, { day: "numeric", month: "long", year: "numeric" })] &&
          byDay[selectedDate.toLocaleString(undefined, { day: "numeric", month: "long", year: "numeric" })].length > 0) ? (
          <ChoresList
            chores={chores}
            choreAssignments={byDay[selectedDate.toLocaleString(undefined, { day: "numeric", month: "long", year: "numeric" })]}
            users={users}
            session={session}
          />
        ) : (
          <Stack height="100%" width="100%" justifyContent="center" alignItems="center" ><Typography variant="h6">No Chores on this day</Typography></Stack>
        )}
      </Stack >
    </Grow>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);
  const initDate = JSON.parse(JSON.stringify(ctx.query.d ? new Date(ctx.query.d as string) : new Date()));
  if (!session) {
    return {
      props: {},
      redirect: {
        destination: `/auth?redirectUrl=${encodeURIComponent(
          ctx.resolvedUrl
        )}`,
      },
    };
  }
  if (!session?.user?.houseId) {
    return {
      props: {},
      redirect: {
        destination: `/profile`,
      },
    };
  }

  console.log(session?.user?.houseId)
  let [chores, choreAssignments, houseUsers] = await Promise.all([
    prisma.chore.findMany(),
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
  chores = chores.filter(chore => chore.owner === null || chore.owner === session?.user?.houseId)
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
      initDate
    },
  };
};

export default Chores;

import { Stack } from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/utils/PrismaClient";
import { Chore, ChoreAssignment, Status, User } from "@prisma/client";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import ChoreOptions from "@/components/chores/ChoresOptions";
import ChoresList from "@/components/chores/ChoresList";

interface Props {
  chores: Chore[];
  choreAssignments: ChoreAssignment[];
  users: Partial<User>[];
  session: Session;
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

const Chores = ({ chores, choreAssignments, users, session }: Props) => {
  const [byDay, setByDay] = useState<{ [key: string]: ChoreAssignment[] } | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    setByDay(groupByDay(choreAssignments))
  }, [choreAssignments])

  return (
    <Stack
      justifyContent='start'
      alignItems='center'
      height='100%'
      margin="auto"
      width='90%'
    >
      <ChoreOptions
        assignmentsByDay={byDay}
        setSelected={setSelectedDate}
        selected={selectedDate}
        users={users}
        chores={chores}
        session={session}
      />
      {(byDay &&
        byDay[selectedDate.toLocaleString(undefined, { day: "numeric", month: "long", year: "numeric" })] &&
        byDay[selectedDate.toLocaleString(undefined, { day: "numeric", month: "long", year: "numeric" })].length > 0) && (
          <ChoresList
            chores={chores}
            choreAssignments={byDay[selectedDate.toLocaleString(undefined, { day: "numeric", month: "long", year: "numeric" })]}
            users={users}
            session={session}
          />
        )
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

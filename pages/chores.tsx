import { Divider, Stack, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/utils/PrismaClient";
import { Chore, ChoreAssignment, User } from "@prisma/client";
import CreateChoreForm from "@/components/chores/CreateChoreForm";
import AssignChoreForm from "@/components/chores/AssignChoreForm";
import { Session } from "next-auth";

interface Props {
  chores: Chore[];
  choreAssignments: ChoreAssignment[];
  users: Partial<User>[];
  session: Session;
}

const Chores = ({ chores, choreAssignments, users, session }: Props) => {
  return (
    <Stack
      justifyContent='center'
      alignItems='center'
      height='100%'
      width='100%'
    >
      <AssignChoreForm
        houseId={session.user.houseId || ""}
        chores={chores}
        users={users}
      />
      <CreateChoreForm houseId={session.user.houseId || ""} />

      <Typography variant='h5'>Chore Assignments</Typography>
      {choreAssignments.map(assignment => (
        <Stack
          key={assignment.id}
          direction='row'
          divider={<Divider flexItem orientation='vertical' />}
          spacing={2}
        >
          <Typography variant='body1'>
            {users.find(user => user.id === assignment.userId)?.firstName}{" "}
            {users.find(user => user.id === assignment.userId)?.lastName}
          </Typography>
          <Typography variant='body1'>
            {chores.find(chore => chore.id === assignment.choreId)?.title}
          </Typography>
        </Stack>
      ))}
    </Stack>
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
      initialState: {
        user: {
          ...session.user,
        },
      },
    },
  };
  return { props: {} };
};

export default Chores;

import { Divider, IconButton, Stack, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/utils/PrismaClient";
import { Chore, ChoreAssignment, Status, User } from "@prisma/client";
import CreateChoreForm from "@/components/chores/CreateChoreForm";
import AssignChoreForm from "@/components/chores/AssignChoreForm";
import { Session } from "next-auth";
import { Check } from "@mui/icons-material";
import { useRouter } from "next/router";
import { ChoreAssignmentIdPutBody } from "./api/houses/[houseId]/chores/assignment/[choreAssignmentId]";
import { useAppVM } from "@/context/Contexts";

interface Props {
  chores: Chore[];
  choreAssignments: ChoreAssignment[];
  users: Partial<User>[];
  session: Session;
}

const Chores = ({ chores, choreAssignments, users, session }: Props) => {
  const router = useRouter();
  const appVM = useAppVM();

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
      <Stack
        divider={<Divider flexItem orientation='vertical' />}
        direction="row"
        spacing={2}
      >
        <Stack
          direction="column"
          divider={<Divider flexItem orientation='horizontal' />}
          alignItems="center"
          spacing={1}
        >
          <Typography variant="h4">Pending</Typography>
          {choreAssignments.map(assignment => {
            if (assignment.status === "Pending") {
              return (
                <Stack
                  key={assignment.id}
                  direction='row'
                  divider={<Divider flexItem orientation='vertical' />}
                  alignItems="center"
                  spacing={2}
                >
                  <Typography variant='body1'>
                    {users.find(user => user.id === assignment.userId)?.firstName}{" "}
                    {users.find(user => user.id === assignment.userId)?.lastName}
                  </Typography>
                  <Typography variant='body1'>
                    {chores.find(chore => chore.id === assignment.choreId)?.title}
                  </Typography>
                  {assignment.userId === session.user.id && (
                    < IconButton onClick={() => { markChoreDone(assignment.id) }}>
                      <Check fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              )
            }
          })}
        </Stack>
        <Stack
          direction="column"
          divider={<Divider flexItem orientation='horizontal' />}
          alignItems="center"
          spacing={1}
        >
          <Typography variant="h4">Completed</Typography>
          {choreAssignments.map(assignment => {
            if (assignment.status === "Completed") {
              return (
                <Stack
                  key={assignment.id}
                  direction='row'
                  divider={<Divider flexItem orientation='vertical' />}
                  alignItems="center"
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
              )
            }
          })}
        </Stack>
      </Stack>
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
  return { props: {} };
};

export default Chores;

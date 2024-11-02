import { Divider, Paper, Stack, Typography, Button, useTheme } from "@mui/material";
import { Chore, ChoreAssignment, House, Payment, User } from "@prisma/client";
import { observer } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AssignmentItem from "@components/chores/choresList/AssignmentItem";

interface props {
  house: House & {
    choreAssignments: (ChoreAssignment & {
      Chore: Chore;
    })[];
    users: User[];
    payments: Payment[];
  };
}

const IndexChores = ({ house }: props) => {
  const router = useRouter();
  const theme = useTheme();
  const { data: session } = useSession();
  if (!session) return null;

  return (
    <Stack justifyContent='center' alignItems='center' spacing={1}>
      <Typography
        variant='h4'
        textAlign='center'
        color={theme.palette.secondary.main}
      >
        Chores
      </Typography>
      <Paper
        sx={{
          minWidth: "100%",
          boxShadow: theme.shadows[5],
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Stack
          justifyContent='center'
          alignItems='start'
          spacing={2}
          padding={2}
        >
          {house.choreAssignments.length > 0 ? (
            house.choreAssignments.map(choreAssignment => (
              <AssignmentItem
                key={choreAssignment.id}
                chore={choreAssignment.Chore}
                firstname={
                  house.users.find(user => user.id === session.user.id)
                    ?.firstName!
                }
                lastname={
                  house.users.find(user => user.id === session.user.id)
                    ?.lastName!
                }
                assignmentId={choreAssignment.id}
                item='MinePending'
                redirectPath='/'
                coloredAvatar={true}
                session={session}
              />
            ))
          ) : (
            <Stack justifyContent='center' alignItems='center' width='100%'>
              <Typography variant='body1' color='text.secondary'>
                No pending chores
              </Typography>
            </Stack>
          )}
          <Divider flexItem />
          <Button
            variant='outlined'
            color='info'
            size='small'
            onClick={() =>
              router.push(
                `/chores${house.choreAssignments.length > 0
                  ? "?d=" +
                  house.choreAssignments
                    .sort((a, b) => {
                      //sort the payments by date
                      return (
                        new Date(b.dueDate).getTime() -
                        new Date(a.dueDate).getTime()
                      );
                    })
                  [house.choreAssignments.length - 1].dueDate.toString()
                    .split("T")[0]
                  : ""
                }`
              )
            }
          >
            Details
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default observer(IndexChores);

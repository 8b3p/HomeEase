import { Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import { Chore, ChoreAssignment, User } from "@prisma/client";
import { Session } from "next-auth";
import { useMemo } from "react";
import DashText from "@/components/UI/DashText";
import AssignmentItem from "@/components/chores/choresList/AssignmentItem";

interface props {
  chores: Chore[];
  choreAssignments: ChoreAssignment[];
  users: Partial<User>[];
  session: Session;
}
// const groupByUserId = (chores: ChoreAssignment[]) => {
//   const grouped = chores.reduce((acc, chore) => {
//     if (!acc[chore.userId]) {
//       acc[chore.userId] = [];
//     }
//     acc[chore.userId].push(chore);
//     return acc;
//   }, {} as { [key: string]: ChoreAssignment[] });
//   return grouped;
// }

const ChoresList = ({ chores, choreAssignments, users, session }: props) => {
  const mine = useMemo(() => {
    return (choreAssignments.length > 0 ? choreAssignments.filter(chore => chore.userId === session.user?.id) : [])
  }, [choreAssignments, session.user?.id])
  const other = useMemo(() => {
    return (choreAssignments.length > 0 ? choreAssignments.filter(chore => chore.userId !== session.user?.id) : [])
  }, [choreAssignments, session.user?.id])
  const isMobile = useMediaQuery('(max-width: 600px)')


  return (
    <Stack
      justifyContent='center'
      alignItems='start'
      width='100%'
      spacing={2}
    >
      <Stack
        width='100%'
        spacing={1}
        paddingBottom="2rem"
      >
        <DashText title="My Chores" maxWidth={1000} />
        <Stack
          width="100%"
          direction={isMobile ? "column" : "row"}
          sx={theme => ({
            boxShadow: theme.shadows[3],
            borderRadius: theme.shape.borderRadius
          })}
        >
          <Stack width={isMobile ? "100%" : "50%"} padding={2}>
            {mine.filter(c => c.status === "Pending").length === 0 ? (
              <Stack height="100%" width="100%" justifyContent="center" alignItems="center"><Typography variant="h6">No Pending Chores</Typography></Stack>
            ) : (
              mine.filter(c => c.status === "Pending").map((choreAssignment) => {
                return (
                  <AssignmentItem
                    key={choreAssignment.id}
                    session={session}
                    chore={chores.find(chore => chore.id === choreAssignment.choreId)}
                    firstname={users.find(user => user.id === choreAssignment.userId)?.firstName || ''}
                    lastname={users.find(user => user.id === choreAssignment.userId)?.lastName || ''}
                    item="MinePending"
                    assignmentId={choreAssignment.id} />
                );
              })
            )}
          </Stack>
          <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />
          <Stack width={isMobile ? "100%" : "50%"} padding={2}>
            {mine.filter(c => c.status === "Completed").length === 0 ? (
              <Stack height="100%" width="100%" justifyContent="center" alignItems="center" ><Typography variant="h6">No Completed Chores</Typography></Stack>
            ) : (
              mine.filter(c => c.status === "Completed").map((choreAssignment) => (
                <AssignmentItem
                  key={choreAssignment.id}
                  session={session}
                  chore={chores.find(chore => chore.id === choreAssignment.choreId)}
                  firstname={users.find(user => user.id === choreAssignment.userId)?.firstName || ''}
                  lastname={users.find(user => user.id === choreAssignment.userId)?.lastName || ''}
                  item="MineComplete"
                  assignmentId={choreAssignment.id}
                />
              ))
            )}
          </Stack>
        </Stack >
      </Stack >
      <Stack
        width='100%'
        spacing={1}
        paddingBottom="2rem"
      >
        <DashText title="Others' Chores" maxWidth={1000} />
        <Stack
          width="100%"
          direction={isMobile ? "column" : "row"}
          sx={theme => ({
            boxShadow: theme.shadows[3],
            borderRadius: theme.shape.borderRadius
          })}
        >
          <Stack width={isMobile ? "100%" : "50%"} padding={2}>
            {other.filter(c => c.status === "Pending").length === 0 ? (
              <Stack height="100%" width="100%" justifyContent="center" alignItems="center" ><Typography variant="h6">No Pending Chores</Typography></Stack>
            ) : (
              other.filter(c => c.status === "Pending").map((choreAssignment) => {
                return (
                  <AssignmentItem
                    key={choreAssignment.id}
                    session={session}
                    chore={chores.find(chore => chore.id === choreAssignment.choreId)}
                    assignmentId={choreAssignment.id}
                    firstname={users.find(user => user.id === choreAssignment.userId)?.firstName || ''}
                    lastname={users.find(user => user.id === choreAssignment.userId)?.lastName || ''}
                    item="OtherPending"
                  />
                )
              })
            )}
          </Stack>
          <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />
          <Stack width={isMobile ? "100%" : "50%"} padding={2}>
            {other.filter(c => c.status === "Completed").length === 0 ? (
              <Stack height="100%" width="100%" justifyContent="center" alignItems="center" ><Typography variant="h6">No Completed Chores</Typography></Stack>
            ) : (
              other.filter(c => c.status === "Completed").map((choreAssignment) => {
                return (
                  <AssignmentItem
                    key={choreAssignment.id}
                    session={session}
                    chore={chores.find(chore => chore.id === choreAssignment.choreId)}
                    assignmentId={choreAssignment.id}
                    firstname={users.find(user => user.id === choreAssignment.userId)?.firstName || ''}
                    lastname={users.find(user => user.id === choreAssignment.userId)?.lastName || ''}
                    item="OtherComplete"
                  />
                )
              })
            )}
          </Stack >
        </Stack >
      </Stack >
    </Stack >
  )
}

export default ChoresList;

import { Divider, IconButton, Stack } from "@mui/material";
import { Chore, ChoreAssignment, Status, User } from "@prisma/client";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { ChoreAssignmentIdPutBody } from "@/pages/api/houses/[houseId]/chores/assignment/[choreAssignmentId]";
import { useAppVM } from "@/context/Contexts";
import { Check } from "@mui/icons-material";

interface props {
  chores: Chore[];
  choreAssignments: ChoreAssignment[];
  users: Partial<User>[];
  session: Session;
}

const groupByUserId = (chores: ChoreAssignment[]) => {
  const grouped = chores.reduce((acc, chore) => {
    if (!acc[chore.userId]) {
      acc[chore.userId] = [];
    }
    acc[chore.userId].push(chore);
    return acc;
  }, {} as { [key: string]: ChoreAssignment[] });
  return grouped;
}

const ChoresList = ({ chores, choreAssignments, users, session }: props) => {
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
      justifyContent='start'
      alignItems='center'
      height='100%'
      margin="auto"
      width='100%'
      spacing={2}
    >
      {
        groupByUserId(choreAssignments)[session.user?.id]?.map((choreAssignment, i) => {
          return (
            <span key={i}>
              {chores.find(chore => chore.id === choreAssignment.choreId)?.title} {users.find(user => user.id === choreAssignment.userId)?.firstName}
              <IconButton onClick={() => markChoreDone(choreAssignment.id)}><Check fontSize="small" /></IconButton>
            </span>
          )
        })
      }
      <Divider orientation="horizontal" flexItem />
      {
        choreAssignments.map((choreAssignment, i) => {
          if (choreAssignment.userId === session.user?.id) return
          return (
            <span key={i}>
              {chores.find(chore => chore.id === choreAssignment.choreId)?.title} {users.find(user => user.id === choreAssignment.userId)?.firstName}
            </span>
          )
        })
      }
    </Stack >
  )
}

export default ChoresList;

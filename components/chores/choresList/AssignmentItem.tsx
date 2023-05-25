import { useAppVM } from '@/context/Contexts';
import { ChoreAssignmentIdPutBody } from '@/pages/api/houses/[houseId]/chores/assignment/[choreAssignmentId]';
import { Check, Close } from '@mui/icons-material';
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import { Chore, Status } from '@prisma/client';
import { observer } from 'mobx-react-lite';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React from 'react';

interface ItemProps {
  chore?: Chore;
  firstname: string;
  lastname: string;
  assignmentId: string;
  item: "MinePending" | "MineComplete" | "OtherPending" | "OtherComplete" | "Cancelled";
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

const AssignmentItem = ({ chore, firstname, lastname, item, session, assignmentId }: ItemProps) => {
  const router = useRouter();
  const appVM = useAppVM();
  const [itemState, setItemState] = React.useState(item);

  const markChore = async (id: string, status: Status) => {
    const body: ChoreAssignmentIdPutBody = { status };
    if (status === Status.Completed) setItemState("MineComplete");
    if (status === Status.Cancelled) setItemState("Cancelled");
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
    <Stack direction="row" alignItems="center" justifyContent="space-between" minHeight="3rem" spacing={2}>
      <ListItem alignItems="flex-start" disablePadding>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp">
            {`${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          sx={{ textTransform: 'capitalize' }}
          primary={chore?.title}
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {firstname} {lastname}
              </Typography>
              {" — " + chore?.description}
            </>
          }
        />
      </ListItem>
      {itemState === "MinePending" ? (
        <Stack direction="row">
          <IconButton onClick={() => markChore(assignmentId, Status.Completed)}><Check color="info" fontSize="small" /></IconButton>
          <IconButton onClick={() => markChore(assignmentId, Status.Cancelled)}><Close color="error" fontSize="small" /></IconButton>
        </Stack>
      ) : (itemState === "MineComplete") || (itemState === "OtherComplete") ? (<Typography color={theme => theme.palette.success.main}>Completed</Typography>) :
        itemState === "Cancelled" ? (
          <Typography color={theme => theme.palette.error.main}>Cancelled</Typography>
        ) : itemState === "OtherPending" && (
          <Typography color={theme => theme.palette.info.main}>Pending</Typography>
        )}
    </Stack >
  )
}

export default observer(AssignmentItem)

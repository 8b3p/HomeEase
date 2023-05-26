import { useAppVM } from '@/context/Contexts';
import { ChoreAssignmentIdPutBody } from '@/pages/api/houses/[houseId]/chores/assignment/[choreAssignmentId]';
import { PaymentIdPutBody } from '@/pages/api/houses/[houseId]/payments/[paymentId]';
import { Check, Close } from '@mui/icons-material';
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import { Status, User } from '@prisma/client';
import { observer } from 'mobx-react-lite';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React from 'react';

interface ItemProps {
  amount: number;
  description: string;
  payer: Partial<User>
  paymentId: string
  type: "OutgoingPending" | "IncomingPending" | "Complete" | "Cancelled";
  session: Session;
}

const AssignmentItem = ({ amount, payer, paymentId, type, session, description }: ItemProps) => {
  const router = useRouter();
  const appVM = useAppVM();
  const [typeState, setTypeState] = React.useState(type);

  const updatePayment = async (id: string, status: Status, amount?: number) => {
    const body: PaymentIdPutBody = { status, amount };
    if (status === Status.Completed) setTypeState("Complete");
    if (status === Status.Cancelled) setTypeState("Cancelled");
    try {
      // Make a POST request to the API endpoint to create the chore
      const res = await fetch(`/api/houses/${session.user.houseId}/payments/${id}`, {
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

      appVM.showAlert('Payment Updated', "success")
      // Reset the form fields and close the create panel
    } catch (e: any) {
      appVM.showAlert(e.message, 'error')
    }
    router.push('/payments')
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" minHeight="3rem" spacing={2}>
      <ListItem alignItems="flex-start" disablePadding>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp">
            {`${payer.firstName![0].toUpperCase()}${payer.lastName![0].toUpperCase()}`}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          sx={{ textTransform: 'capitalize' }}
          primary={"$" + amount}
          secondary={
            <>
              <Typography
                sx={{ display: 'inline', textTransform: 'capitalize' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {payer.firstName + " " + payer.lastName}
              </Typography>
              {" — " + description}
            </>
          }
        />
      </ListItem>
      {typeState === "OutgoingPending" ? (
        <Stack direction="row">
          <IconButton onClick={() => updatePayment(paymentId, Status.Completed)}><Check color="info" fontSize="small" /></IconButton>
          <IconButton onClick={() => updatePayment(paymentId, Status.Cancelled)}><Close color="error" fontSize="small" /></IconButton>
        </Stack>
      ) : (typeState === "Complete") ? (<Typography color={theme => theme.palette.success.main}>Completed</Typography>) :
        typeState === "Cancelled" ? (
          <Typography color={theme => theme.palette.error.main}>Cancelled</Typography>
        ) : typeState === "IncomingPending" && (
          <Typography color={theme => theme.palette.info.main}>Pending</Typography>
        )}
    </Stack >
  )
}

export default observer(AssignmentItem)

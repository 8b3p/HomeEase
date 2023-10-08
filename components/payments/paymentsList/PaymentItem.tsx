import { useAppVM } from "@/context/Contexts";
import AppVM from "@/context/appVM";
import { PaymentIdPutBody } from "@/pages/api/houses/[houseId]/payments/[paymentId]";
import { Check, Close, Edit } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Status, User } from "@prisma/client";
import { observer } from "mobx-react-lite";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface ItemProps {
  amount: number;
  description: string;
  user: Partial<User>;
  paymentId: string;
  redirectPath: string;
  type: "OutgoingPending" | "IncomingPending" | "Complete" | "Cancelled";
  session: Session;
}

const AssignmentItem = ({
  amount,
  user,
  paymentId,
  type,
  session,
  description,
  redirectPath,
}: ItemProps) => {
  const router = useRouter();
  const appVM = useAppVM();
  const [editAmount, setAmount] = useState<number>(amount);
  const [amountError, setAmountError] = useState("");
  const [editDescription, setDescription] = useState(description);
  const [descriptionError, setDescriptionError] = useState("");
  const [typeState, setTypeState] = useState(type);
  const [editOpen, setEditOpen] = useState(false);

  const toggleDialog = () => {
    setAmount(amount);
    setDescription(description);
    setEditOpen(prev => !prev);
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    if (editDescription === "") {
      setDescriptionError("Description must be entered");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (editAmount <= 0) {
      setAmountError("Amount must be greater than 0");
      isValid = false;
    } else {
      setAmountError("");
    }
    return isValid;
  };

  const updatePayment = async (
    id: string,
    status: Status,
    amount?: number,
    description?: string
  ) => {
    if (status === Status.Completed) setTypeState("Complete");
    if (status === Status.Cancelled) setTypeState("Cancelled");
    if (status === Status.Pending) {
      const body: PaymentIdPutBody = { description, amount };
      try {
        // Make a POST request to the API endpoint to create the chore
        const res = await fetch(
          `/api/houses/${session.user.houseId}/payments/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          AppVM.showAlert(data.message, "error");
        }
        AppVM.showAlert("Payment Updated", "success");
        // Reset the form fields and close the create panel
      } catch (e: any) {
        AppVM.showAlert(e.message, "error");
      }
    } else {
      const body: PaymentIdPutBody = { status };
      try {
        // Make a POST request to the API endpoint to create the chore
        const res = await fetch(
          `/api/houses/${session.user.houseId}/payments/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          AppVM.showAlert(data.message, "error");
        }
        AppVM.showAlert("Payment Updated", "success");
        // Reset the form fields and close the create panel
      } catch (e: any) {
        AppVM.showAlert(e.message, "error");
      }
    }
    router.push(redirectPath);
  };

  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      minHeight='3rem'
      spacing={2}
    >
      <ListItem alignItems='flex-start' disablePadding>
        <ListItemAvatar>
          <Avatar alt='Remy Sharp'>
            {`${user.firstName![0].toUpperCase()}${user.lastName![0].toUpperCase()}`}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          sx={{ textTransform: "capitalize" }}
          primary={"$" + amount}
          secondary={
            <>
              <Typography
                sx={{ display: "inline", textTransform: "capitalize" }}
                component='span'
                variant='body2'
                color='text.primary'
              >
                {user.firstName + " " + user.lastName}
              </Typography>
              {" — " + description}
            </>
          }
        />
      </ListItem>
      {typeState === "OutgoingPending" ? (
        <Stack direction='row'>
          <IconButton
            onClick={() => updatePayment(paymentId, Status.Completed)}
          >
            <Check color='success' fontSize='small' />
          </IconButton>
          <IconButton
            onClick={() => updatePayment(paymentId, Status.Cancelled)}
          >
            <Close color='error' fontSize='small' />
          </IconButton>
        </Stack>
      ) : typeState === "Complete" ? (
        <Typography color={theme => theme.palette.success.main}>
          Completed
        </Typography>
      ) : typeState === "Cancelled" ? (
        <Typography color={theme => theme.palette.error.main}>
          Cancelled
        </Typography>
      ) : (
        typeState === "IncomingPending" && (
          <Stack direction='row'>
            <IconButton
              onClick={() => {
                toggleDialog();
              }}
            >
              <Edit color='info' fontSize='small' />
            </IconButton>
          </Stack>
        )
      )}
      <Dialog
        open={editOpen}
        onClose={() => {
          toggleDialog();
        }}
      >
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`${user.firstName} ${user.lastName}`}
          </DialogContentText>
          <Stack spacing={2} marginTop={2}>
            <TextField
              required
              inputProps={{
                min: 0,
                inputMode: "decimal",
                pattern: "^[0-9]*.?[0-9]+$",
              }}
              label='Amount'
              value={editAmount}
              onChange={e => {
                setAmount(parseFloat(e.target.value || "0"));
                amountError && setAmountError("");
              }}
              error={amountError !== ""}
              helperText={amountError}
              fullWidth
            />
            <TextField
              required
              label='Description'
              value={editDescription}
              onChange={e => {
                setDescription(e.target.value);
                descriptionError && setDescriptionError("");
              }}
              error={descriptionError !== ""}
              helperText={descriptionError}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              toggleDialog();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              updatePayment(
                paymentId,
                Status.Pending,
                editAmount,
                editDescription
              );
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default observer(AssignmentItem);

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

interface EditPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (amount: number, description: string) => void;
  initialAmount: number;
  initialDescription: string;
  userName: string;
}

const EditPaymentDialog: React.FC<EditPaymentDialogProps> = ({
  open,
  onClose,
  onSave,
  initialAmount,
  initialDescription,
  userName,
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [description, setDescription] = useState<string>(initialDescription);
  const [amountError, setAmountError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const handleSave = () => {
    let isValid = true;
    if (description.trim() === "") {
      setDescriptionError("Description must be entered");
      isValid = false;
    } else {
      setDescriptionError("");
    }
    if (amount <= 0) {
      setAmountError("Amount must be greater than 0");
      isValid = false;
    } else {
      setAmountError("");
    }

    if (isValid) {
      onSave(amount, description);
    }
  };

  const handleClose = () => {
    // Reset errors and close dialog
    setAmountError("");
    setDescriptionError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Payment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Edit payment details for ${userName}.`}
        </DialogContentText>
        <Stack spacing={2} marginTop={2}>
          <TextField
            required
            label="Amount"
            type="number"
            value={amount}
            error={amountError !== ""}
            helperText={amountError}
            fullWidth
            inputProps={{
              min: 0,
              step: "0.01",
            }}
            onChange={(e) => {
              setAmount(parseFloat(e.target.value) || 0);
              if (amountError) setAmountError("");
            }}
          />
          <TextField
            required
            label="Description"
            value={description}
            error={descriptionError !== ""}
            helperText={descriptionError}
            fullWidth
            onChange={(e) => {
              setDescription(e.target.value);
              if (descriptionError) setDescriptionError("");
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPaymentDialog;


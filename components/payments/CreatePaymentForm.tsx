import { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Button,
  Drawer,
  CircularProgress,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { Status, User } from "@prisma/client";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { Add } from "@mui/icons-material";
import { PaymentPostBody } from "@pages/api/houses/[houseId]/payments";
import AppVM from "@context/appVM";
import PaymentInputs from "./PaymentInputs";
import { useAppVM } from "@context/Contexts";
import PaymentFormVM from "@context/PaymentFormVM";
import { Session } from "next-auth";

interface props {
  users: Partial<User>[];
  houseId: string;
  isIcon?: boolean;
  session: Session;
  variant?: "text" | "outlined" | "contained";
}

const CreatePaymentForm = ({
  users,
  houseId,
  isIcon,
  session,
  variant = "outlined",
}: props) => {
  const appVM = useAppVM();
  const router = useRouter();
  const [paymentFormVM, setPaymentFormVM] = useState<PaymentFormVM | null>(
    null
  );
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [isAssignPanelOpen, setAssignPanelOpen] = useState(false);

  useEffect(() => {
    if (isAssignPanelOpen) return;
    setPaymentFormVM(
      appVM.newPaymentForm(users, houseId, new Date(Date.now()), session.user)
    );
  }, [isAssignPanelOpen, appVM, users, houseId, session.user]);

  if (!paymentFormVM) return null;

  const toggleAssignPanel = () => {
    setAssignPanelOpen(prevState => !prevState);
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    if (!paymentFormVM.RecipientId) {
      paymentFormVM.RecipientIdError = "A Recipient must be selected";
      isValid = false;
    } else {
      paymentFormVM.RecipientIdError = "";
    }

    if (paymentFormVM.PayersId.length === 0) {
      paymentFormVM.PayersIdError = "A Payer must be selected";
      isValid = false;
    } else {
      paymentFormVM.PayersIdError = "";
    }
    if (paymentFormVM.Description === "") {
      paymentFormVM.DescriptionError = "Description must be entered";
      isValid = false;
    } else {
      paymentFormVM.DescriptionError = "";
    }
    if (paymentFormVM.IsSeparate) {
      Object.entries(paymentFormVM.CustomAmounts).forEach(
        ([userId, amount]) => {
          if (amount <= 0) {
            paymentFormVM.CustomAmountsError = {
              ...paymentFormVM.CustomAmountsError,
              [userId]: "Amount must be greater than 0",
            };
            isValid = false;
          } else {
            paymentFormVM.CustomAmountsError = {
              ...paymentFormVM.CustomAmountsError,
              [userId]: "",
            };
          }
        }
      );
    } else {
      if (paymentFormVM.Amount <= 0) {
        paymentFormVM.AmountError = "Amount must be greater than 0";
        isValid = false;
      } else {
        paymentFormVM.AmountError = "";
      }
    }
    if (paymentFormVM.PaymentDate === null) {
      paymentFormVM.PaymentDateError = "Due date must be selected";
      isValid = false;
    } else {
      paymentFormVM.PaymentDateError = "";
    }
    return isValid;
  };

  const handleCreatePayment = async () => {
    if (!validateInputs()) return;
    // Perform payment creation logic here
    paymentFormVM.IsLoading = true;
    const bodies: PaymentPostBody[] = paymentFormVM.PayersId.filter(
      id => id !== paymentFormVM.RecipientId
    ).map(
      payerId =>
      ({
        amount: parseFloat(
          (paymentFormVM.IsSeparate
            ? paymentFormVM.CustomAmounts[payerId]
            : (paymentFormVM.Amount || 0) / paymentFormVM.PayersId.length
          ).toFixed(2)
        ),
        payerId,
        description: paymentFormVM.Description,
        status: Status.Pending,
        recipientId: paymentFormVM.RecipientId,
        createdAt: new Date(paymentFormVM.PaymentDate),
      } as PaymentPostBody)
    );
    const res = await fetch(`/api/houses/${houseId}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodies),
    });
    const data = await res.json();
    if (!res.ok) {
      AppVM.showAlert(data.message, "error");
    }
    // Reset the form fields and close the create panel
    paymentFormVM.IsLoading = false;
    setAssignPanelOpen(false);
    router.push("/payments");
  };

  return (
    <Stack justifyContent='center' alignItems='center'>
      {isIcon ? (
        <IconButton onClick={toggleAssignPanel}>
          <Add fontSize='small' color='primary' />
        </IconButton>
      ) : isMobile ? (
        <IconButton onClick={toggleAssignPanel}>
          <Add fontSize='small' color='primary' />
        </IconButton>
      ) : (
        <Button variant={variant} onClick={toggleAssignPanel}>
          Add Payment
        </Button>
      )}
      {/* Create Payment Panel */}
      <Drawer anchor='right' open={isAssignPanelOpen}>
        <Stack
          justifyContent='space-between'
          alignItems='stretch'
          width={375}
          maxWidth='100vw'
          padding={3}
          height='100%'
        >
          {paymentFormVM.IsLoading ? (
            <Stack
              width='100%'
              height='100%'
              justifyContent='center'
              alignItems='center'
            >
              <CircularProgress />
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Typography variant='h5'>Add Payment</Typography>
              <PaymentInputs paymentFormVM={paymentFormVM} />
            </Stack>
          )}
          <Stack direction='row' spacing={1}>
            <Button
              variant='contained'
              onClick={handleCreatePayment}
              fullWidth
              disabled={paymentFormVM.IsLoading}
            >
              Submit
            </Button>
            <Button
              variant='outlined'
              onClick={toggleAssignPanel}
              fullWidth
              disabled={paymentFormVM.IsLoading}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Stack>
  );
};

export default observer(CreatePaymentForm);

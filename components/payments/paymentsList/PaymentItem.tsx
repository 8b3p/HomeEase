import AppVM from "@context/appVM";
import { PaymentIdPutBody } from "@pages/api/houses/[houseId]/payments/[paymentId]";
import { Stack, useTheme, } from "@mui/material";
import { Status, User } from "@prisma/client";
import { observer } from "mobx-react-lite";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import PaymentDetails from "./PaymentDetails";
import PaymentActions from "./PaymentActions";
import EditPaymentDialog from "./EditPaymentDialog";

interface props {
  amount: number; description: string; user: Partial<User>; paymentId: string; redirectPath: string;
  direction: "Outgoing" | "Incoming"; status: Status; date: Date; isLast: boolean; session: Session;
}

const PaymentItem = ({ amount, description, user, paymentId, direction, status, date, isLast, session, redirectPath, }: props) => {
  const router = useRouter();
  const theme = useTheme();
  const [editOpen, setEditOpen] = useState(false);

  const toggleDialog = () => { setEditOpen((prev) => !prev); };

  const handleEditSave = async (newAmount: number, newDescription: string) => {
    const validateInputs = (): boolean => {
      let isValid = true;
      if (newDescription.trim() === "") {
        AppVM.showAlert("Description must be entered", "error");
        isValid = false;
      }
      if (newAmount <= 0) {
        AppVM.showAlert("Amount must be greater than 0", "error");
        isValid = false;
      }
      return isValid;
    };
    if (!validateInputs()) return;
    const body: PaymentIdPutBody = { amount: newAmount, description: newDescription };
    try {
      const res = await fetch(`/api/houses/${session.user.houseId}/payments/${paymentId}`,
        { method: "PUT", headers: { "Content-Type": "application/json", }, body: JSON.stringify(body), });
      const data = await res.json();
      if (!res.ok) {
        AppVM.showAlert(data.message, "error");
      } else {
        AppVM.showAlert("Payment Updated", "success");
      }
    } catch (e: any) {
      AppVM.showAlert(e.message, "error");
    }
    router.push(redirectPath);
    setEditOpen(false);
  };

  const handleApprove = async () => {
    const body: PaymentIdPutBody = { status: Status.Completed };
    try {
      const res = await fetch(`/api/houses/${session.user.houseId}/payments/${paymentId}`,
        { method: "PUT", headers: { "Content-Type": "application/json", }, body: JSON.stringify(body), });
      const data = await res.json();
      if (!res.ok) {
        AppVM.showAlert(data.message, "error");
      } else {
        AppVM.showAlert("Payment Approved", "success");
      }
    } catch (e: any) {
      AppVM.showAlert(e.message, "error");
    }
    router.push(redirectPath);
  };

  const handleCancel = async () => {
    const body: PaymentIdPutBody = { status: Status.Cancelled };
    try {
      const res = await fetch(`/api/houses/${session.user.houseId}/payments/${paymentId}`,
        { method: "PUT", headers: { "Content-Type": "application/json", }, body: JSON.stringify(body), });
      const data = await res.json();
      if (!res.ok) {
        AppVM.showAlert(data.message, "error");
      } else {
        AppVM.showAlert("Payment Cancelled", "success");
      }
    } catch (e: any) {
      AppVM.showAlert(e.message, "error");
    }
    router.push(redirectPath);
  };

  if (!user || !amount || !description || !date || !status) return null;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" minHeight="4rem" spacing={2}
      sx={{ borderBottom: !isLast ? `1px solid ${theme.palette.divider}` : "", paddingY: 1, }} >
      {/* Payment Details */}
      <PaymentDetails amount={amount} description={description} user={user} date={date} />

      {/* Action Buttons or Status Text */}
      <PaymentActions direction={direction} status={status} onApprove={handleApprove} onCancel={handleCancel} onEdit={toggleDialog}
        statusText={status === Status.Completed || status === Status.Cancelled ? status : ""} />

      {/* Edit Payment Dialog for Incoming Pending Payments */}
      {status === Status.Pending && (
        <EditPaymentDialog
          open={editOpen}
          onClose={toggleDialog}
          onSave={handleEditSave}
          initialAmount={amount}
          initialDescription={description}
          userName={`${user.firstName} ${user.lastName}`}
        />
      )}
    </Stack>
  );
};

export default observer(PaymentItem);


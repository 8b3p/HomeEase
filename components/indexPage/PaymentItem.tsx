import { Check } from "@mui/icons-material";
import {
  Avatar,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { User } from "@prisma/client";
import { stringAvatar } from "@components/layout/Navbar/NavbarMenu";
import { observer } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useThemeVM } from "@/context/Contexts";
import { MarkAllPostBody } from "@/pages/api/houses/[houseId]/payments/markAll";
import AppVM from "@/context/appVM";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

interface props {
  user: User;
  balance: { amount: number; owe: boolean };
  houseId: string;
}

const IndexPaymentItem = ({ user, balance, houseId }: props) => {
  const router = useRouter();
  const themeVM = useThemeVM();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  if (!session) return null;

  const handlePaymentsCheck = async (secondUserId: string) => {
    setIsLoading(true);
    const res = await fetch(`/api/houses/${houseId}/payments/markAll`, {
      method: "POST",
      body: JSON.stringify({
        firstUserId: session.user.id,
        secondUserId,
      } as MarkAllPostBody),
    });
    if (res.status === 200) {
      await router.replace("/");
      setIsLoading(false);
    } else {
      res.json().then(data => {
        AppVM.showAlert(data.message, "error");
      });
      setIsLoading(false);
    }
  };

  return (
    <ListItem alignItems='flex-start' disablePadding key={user.id}>
      <ListItemAvatar>
        <Avatar
          alt='Remy Sharp'
          {...stringAvatar(
            user.firstName + " " + user.lastName,
            themeVM.themeType
          )}
        ></Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={theme => ({
          textTransform: "capitalize",
          color:
            balance.amount === 0
              ? ""
              : balance.owe
              ? theme.palette.error.light
              : theme.palette.success.main,
        })}
        primary={"$" + balance.amount}
        secondary={
          <Typography
            sx={{ display: "inline", textTransform: "capitalize" }}
            component='span'
            variant='body2'
            color='text.primary'
          >
            {balance.amount === 0
              ? `${user.firstName} ${user.lastName} is all good`
              : balance.owe
              ? `You owe ${user.firstName} ${user.lastName}`
              : `${user.firstName} ${user.lastName} owes you`}
          </Typography>
        }
      />
      {/*checkmark to mark all payments between 2 users completed*/}
      {balance.amount !== 0 ? (
        <IconButton
          onClick={() => {
            if (isLoading) return;
            handlePaymentsCheck(user.id);
          }}
        >
          {isLoading ? (
            <CircularProgress color='info' size={24} />
          ) : (
            <Check color='info' />
          )}
        </IconButton>
      ) : null}
    </ListItem>
  );
};

export default observer(IndexPaymentItem);

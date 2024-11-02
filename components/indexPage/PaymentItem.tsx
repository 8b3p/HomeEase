import { Check, ArrowBackIosRounded } from "@mui/icons-material";
import {
  Avatar,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import { Payment, Status, User } from "@prisma/client";
import { stringAvatar } from "@components/layout/Navbar/NavbarMenu";
import { observer } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useThemeVM } from "@context/Contexts";
import { MarkAllPostBody } from "@pages/api/houses/[houseId]/payments/markAll";
import AppVM from "@context/appVM";
import { useEffect, useState } from "react";

interface props {
  user: User;
  balance: { amount: number; owe: boolean };
  houseId: string;
}

const IndexPaymentItem = ({ user, balance, houseId }: props) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<boolean>(false);
  const themeVM = useThemeVM();
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[] | undefined>(undefined);
  const { data: session } = useSession();

  useEffect(() => {
    // get user payments
    const fetchPayments = async () => {
      const res = await fetch(
        `/api/users/${user.id}/payments?status=${Status.Pending}`,
        { headers: { contentType: "application/json" } }
      );
      const payments = (await res.json()).payments as Payment[];
      setPayments(payments);
    };
    fetchPayments();
  }, [user.id]);

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
    <>
      <ListItem alignItems='center' disablePadding key={user.id}>
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
          primary={
            <Typography fontSize='1.2rem'>
              {AppVM.currency + balance.amount}
            </Typography>
          }
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
        <IconButton
          onClick={() => {
            setExpanded(prev => !prev);
          }}
        >
          <ArrowBackIosRounded
            color='info'
            sx={{
              ...(expanded
                ? { transform: "rotate(90deg)" }
                : { transform: "rotate(-90deg)" }),
              transition: "transform 0.2s",
              color: "gray",
            }}
            fontSize='small'
          />
        </IconButton>
      </ListItem>
      <Collapse
        in={expanded}
        timeout='auto'
        unmountOnExit
        sx={{ width: "100%" }}
      >
        <List component='div' disablePadding>
          {payments && payments.length ? (
            payments.map(payment => (
              <ListItem
                key={payment.id}
                onDoubleClick={() => {
                  router.replace(
                    `/payments?d=${payment.createdAt.toString().split("T")[0]}`
                  );
                }}
                sx={{ cursor: "pointer" }}
              >
                <>
                  <ListItemText
                    sx={theme => ({
                      color:
                        payment.payerId === session.user.id
                          ? theme.palette.error.light
                          : theme.palette.success.main,
                    })}
                    primary={AppVM.currency + payment.amount}
                    secondary={
                      <Typography
                        sx={{ display: "inline", textTransform: "capitalize" }}
                        component='span'
                        variant='body2'
                        color='text.secondary'
                      >
                        {payment.description}
                      </Typography>
                    }
                  />
                  <Typography
                    sx={{ display: "inline", textTransform: "capitalize" }}
                    component='span'
                    variant='body2'
                    color='text.secondary'
                  >
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </Typography>
                </>
              </ListItem>
            ))
          ) : payments ? (
            // no payments
            <ListItem>
              <ListItemText primary='No payments' />
            </ListItem>
          ) : (
            // loading, show loading skeleton
            <>
              <ListItem>
                <ListItemText
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  primary={
                    <Skeleton
                      variant='rectangular'
                      height={20}
                      width={80}
                      sx={{ borderRadius: "5px" }}
                    />
                  }
                  secondary={
                    <Skeleton
                      variant='rectangular'
                      height={16}
                      width={150}
                      sx={{ borderRadius: "5px" }}
                    />
                  }
                />
                <Skeleton
                  variant='rectangular'
                  height={16}
                  width={100}
                  sx={{ borderRadius: "5px" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  primary={
                    <Skeleton
                      variant='rectangular'
                      height={20}
                      width={80}
                      sx={{ borderRadius: "5px" }}
                    />
                  }
                  secondary={
                    <Skeleton
                      variant='rectangular'
                      height={16}
                      width={150}
                      sx={{ borderRadius: "5px" }}
                    />
                  }
                />
                <Skeleton
                  variant='rectangular'
                  height={16}
                  width={100}
                  sx={{ borderRadius: "5px" }}
                />
              </ListItem>
            </>
          )}
        </List>
      </Collapse>
    </>
  );
};

export default observer(IndexPaymentItem);

import { ArrowDropDown, ArrowDropUp, InfoOutlined } from "@mui/icons-material";
import { Divider, Grid, Paper, Stack, Tooltip, Typography, Button, useMediaQuery, Theme } from "@mui/material";
import { Chore, ChoreAssignment, House, Payment, User } from "@prisma/client";
import { observer } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useThemeVM } from "@/context/Contexts";
import IndexPaymentItem from "@components/indexPage/PaymentItem";
import { MarkAllPostBody } from "@/pages/api/houses/[houseId]/payments/markAll";
import AppVM from "@/context/appVM";

interface props {
  house: (House & {
    choreAssignments: (ChoreAssignment & {
      Chore: Chore;
    })[];
    users: User[];
    payments: Payment[];
  });
  balances: { [key: string]: { amount: number, owe: boolean } };
}

const IndexPayments = ({ house, balances }: props) => {
  const router = useRouter();
  const isExtraSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const { data: session } = useSession();
  if (!session) return null;

  return (
    <Stack justifyContent="center" alignItems="center" spacing={1}>
      <Typography variant="h4" textAlign="center" color={theme => theme.palette.secondary.main}>
        Payments
      </Typography>
      <Paper
        sx={(theme) => ({
          minWidth: "100%",
          boxShadow: theme.shadows[5],
          borderRadius: theme.shape.borderRadius,
        })}
      >
        <Stack justifyContent="center" alignItems="start" spacing={2} padding={2} width="100%">
          <Stack justifyContent="center" alignItems="start" width="100%" spacing={1}>
            <Grid container spacing={1} width="100%">
              <Grid item md={5} xs={12}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h4" textAlign="center">Summary</Typography>
                  <Tooltip title="This is the summary of all the pending payments together">
                    <InfoOutlined color="disabled" fontSize="small" />
                  </Tooltip>
                </Stack>
              </Grid>
              <Grid item md={7} xs={12}>
                <Stack direction="row" justifyContent={isExtraSmallScreen ? "" : "end"} alignItems="center" spacing={1}>
                  <Typography variant="h6" textAlign="center" color={theme => theme.palette.success.main}>
                    ${house.payments.filter(payment => payment.recipientId === session.user.id).reduce((a, b) => a + b.amount, 0).toFixed(2)}<ArrowDropUp color="success" />
                  </Typography>
                  <Typography variant="h6" textAlign="center" color={theme => theme.palette.error.light}>
                    ${house.payments.filter(payment => payment.payerId === session.user.id).reduce((a, b) => a + b.amount, 0).toFixed(2)}<ArrowDropDown color="error" />
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            {house.users.filter(user => user.id !== session.user.id).map((user) => (
              <IndexPaymentItem key={user.id} houseId={house.id} user={user} balance={balances[user.id]} />
            ))}
          </Stack>
          <Divider flexItem />
          <Button variant="outlined" color="info" size="small" onClick={() => router.push(`/payments${house.payments.length > 0 ? "?d=" + house.payments.sort((a, b) => {
            //sort the payments by date
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })[house.payments.length - 1].createdAt.toString().split("T")[0] : ""}`)}>Details</Button>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default observer(IndexPayments);


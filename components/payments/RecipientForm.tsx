import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
  Box,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { observer } from "mobx-react-lite";
import PaymentFormVM from "@/context/PaymentFormVM";

interface props { paymentFormVM: PaymentFormVM }

const RecipientForm = ({ paymentFormVM }: props) => {
  const router = useRouter();
  const { data: session } = useSession();
  if (!session) { router.push('/'); return null; }

  return (
    <>
      {!paymentFormVM.IsSeparate && (
        <TextField
          required
          inputProps={{
            min: 0,
            inputMode: "decimal",
            pattern: "^[0-9]*.?[0-9]+$",
          }}
          label='Amount'
          value={paymentFormVM.Amount}
          onChange={e => {
            paymentFormVM.Amount = parseFloat(e.target.value || "0");
            paymentFormVM.AmountError = "";
          }}
          error={paymentFormVM.AmountError !== ""}
          helperText={paymentFormVM.AmountError}
          fullWidth
        />
      )}
      <TextField
        required
        label='Desciption'
        value={paymentFormVM.Description}
        onChange={e => {
          paymentFormVM.Description = e.target.value;
          paymentFormVM.DescriptionError = "";

        }}
        error={paymentFormVM.DescriptionError !== ""}
        helperText={paymentFormVM.DescriptionError}
        fullWidth
      />
      <TextField
        required
        label='Date Of Expense'
        InputLabelProps={{ shrink: true }}
        type='date'
        value={paymentFormVM.PaymentDate}
        onChange={e => {
          paymentFormVM.PaymentDate = e.target.value || "";
          paymentFormVM.PaymentDateError = "";
        }}
        error={paymentFormVM.PaymentDateError !== ""}
        helperText={paymentFormVM.PaymentDateError}
        fullWidth
      />
      <FormControl error={paymentFormVM.PayersIdError !== ""}>
        <InputLabel required id='payers-select-id'>
          Payers
        </InputLabel>
        <Select
          required
          labelId='payers-select-id'
          label='Payers'
          multiple
          value={paymentFormVM.PayersId}
          renderValue={selected => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map(value => {
                const user = paymentFormVM.Users.find(user => user.id === value);
                return (
                  <Chip
                    key={value}
                    label={
                      <Typography sx={{ textTransform: "capitalize" }}>
                        {user?.firstName} {user?.lastName}
                      </Typography>
                    }
                  />
                );
              })}
            </Box>
          )}
          onChange={e => {
            const {
              target: { value },
            } = e;
            paymentFormVM.PayersId = (typeof value === "string" ? value.split(",") : value);
            const payerIds =
              typeof value === "string" ? value.split(",") : value;
            if (paymentFormVM.IsSeparate) {
              paymentFormVM.CustomAmounts = payerIds.reduce((acc, payerId) => {
                if (paymentFormVM.CustomAmounts[payerId] && paymentFormVM.CustomAmounts[payerId] > 0) {
                  return { ...acc, [payerId]: paymentFormVM.CustomAmounts[payerId] };
                } else {
                  return { ...acc, [payerId]: 0 };
                }
              }, {} as { [key: string]: number });
            }
            paymentFormVM.PayersIdError = "";
          }}
          fullWidth
        >
          {paymentFormVM.Users.map(user => {
            return (
              <MenuItem
                key={user.id}
                value={user.id}
                sx={{ textTransform: "capitalize" }}
              >
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  width='100%'
                >
                  <Typography>
                    {user.firstName} {user.lastName}
                  </Typography>
                  {paymentFormVM.PayersId.indexOf(user.id!) > -1 && !paymentFormVM.IsSeparate ? (
                    <Typography>
                      {((paymentFormVM.Amount || 0) / paymentFormVM.PayersId.length).toFixed(2)}
                    </Typography>
                  ) : (
                    <Typography>{paymentFormVM.CustomAmounts[user.id!]}</Typography>
                  )}
                </Stack>
              </MenuItem>
            );
          })}
        </Select>
        {paymentFormVM.PayersIdError !== "" && (
          <FormHelperText error>{paymentFormVM.PayersIdError}</FormHelperText>
        )}
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            checked={paymentFormVM.IsSeparate}
            onChange={e => {
              if (!e.target.checked) { paymentFormVM.CustomAmounts = {}; } else {
                paymentFormVM.CustomAmounts = paymentFormVM.PayersId.reduce((acc, payerId) => ({
                  ...acc,
                  [payerId]: parseInt(((paymentFormVM.Amount || 0) / paymentFormVM.PayersId.length).toString()),
                }), {})
              }
              paymentFormVM.IsSeparate = e.target.checked;
            }}
          />
        }
        label='Separate'
      />
      {paymentFormVM.IsSeparate && (
        <Stack spacing={2}>
          {paymentFormVM.PayersId.map(payerId => {
            const user = paymentFormVM.Users.find(user => user.id === payerId);
            if (user?.id === session.user.id) return null;
            return (
              <TextField
                key={payerId}
                required
                inputProps={{
                  min: 0,
                  inputMode: "decimal",
                  pattern: "^[0-9]*.?[0-9]*$",
                }}
                label={`${user?.firstName} ${user?.lastName}`}
                InputLabelProps={{
                  sx: { textTransform: "capitalize" },
                }}
                hiddenLabel
                value={paymentFormVM.CustomAmounts[payerId]}
                onChange={e => {
                  const {
                    target: { value },
                  } = e;
                  paymentFormVM.CustomAmounts = { ...paymentFormVM.CustomAmounts, [payerId]: parseFloat(value || "0"), }
                  paymentFormVM.CustomAmountsError = { ...paymentFormVM.CustomAmountsError, [payerId]: "", }
                }}
                error={
                  paymentFormVM.CustomAmountsError[payerId] !== undefined &&
                  paymentFormVM.CustomAmountsError[payerId] !== ""
                }
                helperText={paymentFormVM.CustomAmountsError[payerId]}
                fullWidth
              />
            );
          })}
          <Typography sx={theme => ({ color: theme.palette.text.secondary })}>
            Total:{" "}
            {Object.values(paymentFormVM.CustomAmounts).length
              ? Object.keys(paymentFormVM.CustomAmounts).reduce((acc, key) => {
                if (key === session.user.id) return acc; return acc += paymentFormVM.CustomAmounts[key]
              }, 0) : 0}
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default observer(RecipientForm)

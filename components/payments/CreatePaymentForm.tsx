import { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
  CircularProgress,
  useMediaQuery,
  IconButton,
  Box,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Status, User } from "@prisma/client";
import { useAppVM } from "@/context/Contexts";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { Add } from "@mui/icons-material";
import { PaymentPostBody } from "@/pages/api/houses/[houseId]/payments";
import { Session } from "next-auth";

interface props {
  users: Partial<User>[];
  houseId: string;
  defaultDate: Date;
  isIcon?: boolean;
  session: Session;
  variant?: "text" | "outlined" | "contained";
}

const CreatePaymentForm = ({ users, houseId, defaultDate, isIcon, variant = "outlined", session }: props) => {
  const appVM = useAppVM()
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [amount, setAmount] = useState<number>();
  const [amountError, setAmountError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [payersId, setPayersId] = useState<string[]>([]);
  const [payersIdError, setPayersIdError] = useState('');
  const [paymentDate, setPaymentDate] = useState<string>(defaultDate.toISOString().split("T")[0]);
  const [paymentDateError, setPaymentDateError] = useState('');
  const [isAssignPanelOpen, setAssignPanelOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmounts, setCustomAmounts] = useState<{ [key: string]: number }>({});
  const [customAmountsError, setCustomAmountsError] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    if (isAssignPanelOpen) {
      setAmount(undefined)
      setAmountError('')
      setDescription('')
      setDescriptionError('')
      setPayersId([])
      setPayersIdError('')
      setPaymentDate(defaultDate.toISOString().split("T")[0])
      setPaymentDateError('')
    }
  }, [isAssignPanelOpen, defaultDate])

  const toggleAssignPanel = () => {
    setAssignPanelOpen((prevState) => !prevState);
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    if (payersId.length === 0) {
      setPayersIdError('A Payer must be selected')
      isValid = false
    } else {
      setPayersIdError('')
    }

    if (description === "") {
      setDescriptionError('Description must be entered')
      isValid = false
    } else {
      setDescriptionError('')
    }

    if (amount === undefined) {
      setAmountError('Amount must be entered')
      isValid = false
    } else if (amount <= 0) {
      setAmountError('Amount must be greater than 0')
      isValid = false
    } else {
      setAmountError('')
    }
    if (isCustom) {
      let isCustomValid = true;
      const remaining = (amount || 0) - (Object.values(customAmounts).length ? Object.values(customAmounts).reduce((acc, amount) => acc += amount) : 0)
      if (remaining !== 0) {
        Object.keys(customAmounts).forEach((userId) => {
          setCustomAmountsError((prev) => ({ ...prev, [userId]: "Remaining must be 0!" }))
        })
        isValid = false
        isCustomValid = false
      }
      Object.entries(customAmounts).forEach(([userId, amount]) => {
        if (amount <= 0) {
          setCustomAmountsError((prev) => ({ ...prev, [userId]: 'Amount must be greater than 0' }))
          isValid = false
        } else if (isCustomValid) {
          setCustomAmountsError((prev) => ({ ...prev, [userId]: '' }))
        }
      })
    }


    if (paymentDate === null) {
      setPaymentDateError('Due date must be selected')
      isValid = false
    } else {
      setPaymentDateError('')
    }

    return isValid
  }

  const handleCreatePayment = async () => {
    if (!validateInputs()) return;

    // Perform payment creation logic here
    setIsLoading(true);
    const res = await Promise.all(payersId.map(async (payerId) => {
      const body: PaymentPostBody = {
        amount: isCustom ? customAmounts[payerId] : ((amount || 0) / payersId.length),
        payerId,
        description,
        status: Status.Pending,
        recipientId: session.user.id,
        createdAt: new Date(paymentDate)
      }

      return fetch(`/api/houses/${houseId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
    }))
    console.log(res)
    res.forEach(async (res) => {
      const data = await res.json();
      console.log(data)
    })
    // Reset the form fields and close the create panel
    setIsLoading(false);
    setAssignPanelOpen(false);
    router.push('/payments')
  };


  return (
    <Stack justifyContent="center" alignItems="center">
      {isIcon ? (
        <IconButton onClick={toggleAssignPanel}><Add fontSize="small" color="primary" /></IconButton>
      )
        : isMobile ? (
          <IconButton onClick={toggleAssignPanel}><Add fontSize="small" color="primary" /></IconButton>
        ) : (
          <Button variant={variant} onClick={toggleAssignPanel}>
            Add Payment
          </Button>
        )}

      {/* Create Payment Panel */}
      <Drawer anchor="right" open={isAssignPanelOpen}>
        <Stack justifyContent="space-between" alignItems="stretch" width={375} padding={3} height="100%">
          {isLoading ? (
            <Stack width="100%" height="100%" justifyContent="center" alignItems="center" >
              <CircularProgress />
            </Stack>) : (
            <Stack spacing={2}>
              <Typography variant="h5">Add Payment</Typography>
              <TextField
                required
                inputProps={{ min: 0, inputMode: 'decimal', pattern: '^[0-9]*\.?[0-9]+$' }}
                label="Amount"
                value={amount}
                onChange={(e) => { setAmount(parseFloat(e.target.value || '0')); amountError && setAmountError('') }}
                error={amountError !== ''}
                helperText={amountError}
                fullWidth
              />
              <TextField
                required
                label="Description"
                value={description}
                onChange={(e) => { setDescription(e.target.value); descriptionError && setDescriptionError('') }}
                error={descriptionError !== ''}
                helperText={descriptionError}
                fullWidth
              />
              <TextField
                required
                label="Payment Date"
                InputLabelProps={{ shrink: true }}
                type="date"
                value={paymentDate}
                onChange={(e) => { setPaymentDate(e.target.value || ''); paymentDateError && setPaymentDateError('') }}
                error={paymentDateError !== ''}
                helperText={paymentDateError}
                fullWidth
              />
              <FormControl error={payersIdError !== ''}>
                <InputLabel required id="payers-select-id">Payers</InputLabel>
                <Select
                  required
                  labelId="payers-select-id"
                  label="Payers"
                  multiple
                  value={payersId}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const user = users.find(user => user.id === value)
                        return (< Chip key={value} label={<Typography sx={{ textTransform: "capitalize" }}>{user?.firstName} {user?.lastName}</Typography>} />)
                      })}
                    </Box>
                  )}
                  onChange={(e) => {
                    const { target: { value }, } = e;
                    const payerIds = typeof value === 'string' ? value.split(',') : value;
                    if (isCustom) {
                      setCustomAmounts(payerIds.reduce((acc, payerId) => ({ ...acc, [payerId]: ((amount || 0) / payerIds.length) }), {}))
                    }
                    setPayersId(typeof value === 'string' ? value.split(',') : value,);
                    payersIdError && setPayersIdError('')
                  }}
                  fullWidth
                >
                  {users.map((user) => {
                    return (
                      <MenuItem key={user.id} value={user.id} sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row" justifyContent="space-between" width="100%">
                          <Typography>
                            {user.firstName} {user.lastName}
                          </Typography>
                          {payersId.indexOf(user.id!) > -1 && !isCustom ? (
                            <Typography>
                              {((amount || 0) / payersId.length).toFixed(2)}
                            </Typography>
                          ) : (
                            <Typography>
                              {customAmounts[user.id!]}
                            </Typography>
                          )}
                        </Stack>
                      </MenuItem>
                    )
                  })}
                </Select>
                {payersIdError !== '' && <FormHelperText error>{payersIdError}</FormHelperText>}
              </FormControl>
              <FormControlLabel control={<Switch checked={isCustom} onChange={(e) => {
                if (!e.target.checked) { setCustomAmounts({}) }
                else { setCustomAmounts(payersId.reduce((acc, payerId) => ({ ...acc, [payerId]: ((amount || 0) / payersId.length) }), {})) }
                setIsCustom(e.target.checked)
              }} />} label="Custom" />
              {isCustom && (
                <Stack spacing={2}>
                  {payersId.map((payerId) => {
                    const user = users.find(user => user.id === payerId)
                    return (
                      <TextField
                        key={payerId}
                        required
                        inputProps={{ min: 0, inputMode: 'decimal', pattern: '^[0-9]*\.?[0-9]*$' }}
                        label={`${user?.firstName} ${user?.lastName}`}
                        hiddenLabel
                        defaultValue={((amount || 0) / payersId.length).toFixed(2)}
                        value={customAmounts[payerId]}
                        onChange={(e) => {
                          const { target: { value }, } = e;
                          setCustomAmounts(prev => ({ ...prev, [payerId]: parseFloat(value || '0') }))
                          customAmountsError[payerId] && setCustomAmountsError(prev => ({ ...prev, [payerId]: '' }))
                        }}
                        error={customAmountsError[payerId] !== undefined && customAmountsError[payerId] !== ''}
                        helperText={customAmountsError[payerId]}
                        fullWidth

                      />
                    )
                  })}
                  <Typography sx={(theme) => ({ color: theme.palette.text.secondary })}>Remaining: {(amount || 0) - (Object.values(customAmounts).length ? Object.values(customAmounts).reduce((acc, amount) => acc += amount) : 0)}</Typography>
                </Stack>
              )}
            </Stack>
          )}
          <Stack direction="row" spacing={1} >
            <Button variant="contained" onClick={handleCreatePayment} fullWidth disabled={isLoading} >
              Submit
            </Button>
            <Button variant="outlined" onClick={toggleAssignPanel} fullWidth disabled={isLoading}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Drawer >
    </Stack >
  );
};

export default observer(CreatePaymentForm);

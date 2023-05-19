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
} from "@mui/material";
import { Chore, User } from "@prisma/client";
import { ChoreAssignPostBody } from "@/pages/api/houses/[houseId]/chores/assignment";
import { useAppVM } from "@/context/Contexts";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

interface props {
  users: Partial<User>[];
  chores: Chore[]
  houseId: string;
}

const AssignChoreForm = ({ users, chores, houseId }: props) => {
  const appVM = useAppVM()
  const [userId, setUserId] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [choreId, setChoreId] = useState('');
  const [choreIdError, setChoreIdError] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [dueDateError, setDueDateError] = useState('');
  const [isAssignPanelOpen, setAssignPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    if (isAssignPanelOpen) {
      setUserId('')
      setUserIdError('')
      setChoreId('')
      setChoreIdError('')
      setDueDate('')
      setDueDateError('')
    }
  }, [isAssignPanelOpen])

  const toggleAssignPanel = () => {
    setAssignPanelOpen((prevState) => !prevState);
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    if (userId === '') {
      setUserIdError('User must be selected')
      isValid = false
    } else {
      setUserIdError('')
    }

    if (choreId === '') {
      setChoreIdError('Chore must be selected')
      isValid = false
    } else {
      setChoreIdError('')
    }

    if (dueDate === null) {
      setDueDateError('Due date must be selected')
      isValid = false
    } else if (new Date(dueDate).getTime() < Date.now()) {
      setDueDateError('Due date must be in the future')
      isValid = false
    } else {
      setDueDateError('')
    }

    return isValid
  }

  const handleAssignChore = async () => {
    setIsLoading(true);
    if (!validateInputs()) return;
    // Perform chore assignment logic here

    const body: ChoreAssignPostBody = {
      userId,
      choreId,
      dueDate: new Date(dueDate),
    }

    try {
      // Make a POST request to the API endpoint to create the chore
      const res = await fetch(`/api/houses/${houseId}/chores/assignment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      const data = await res.json();

      console.log("Chore created:", data);
      // Reset the form fields and close the create panel
      toggleAssignPanel();
    } catch (e: any) {
      appVM.showAlert(e.message, 'error')
    }
    setIsLoading(false);
    setAssignPanelOpen(false);
    router.push('/chores')
  };


  return (
    <Stack justifyContent="center" alignItems="center">
      <Button variant="outlined" onClick={toggleAssignPanel}>
        Assign Chore
      </Button>

      {/* Assign Chore Panel */}
      <Drawer anchor="right" open={isAssignPanelOpen}>
        <Stack justifyContent="space-between" alignItems="stretch" width={375} padding={3} height="100%">
          {isLoading ? (
            <Stack width="100%" height="100%" justifyContent="center" alignItems="center" >
              <CircularProgress />
            </Stack>) : (
            <Stack spacing={2}>
              <Typography variant="h5">Assign Chore</Typography>
              <FormControl error={userIdError !== ''}>
                <InputLabel id="user-select-id">User</InputLabel>
                <Select
                  labelId="user-select-id"
                  label="User"
                  value={userId}
                  onChange={(e) => { setUserId(e.target.value); if (userIdError) validateInputs() }}
                  fullWidth
                >
                  {users.map((user) => {
                    return <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</MenuItem>
                  })}
                </Select>
                {userIdError !== '' && <FormHelperText error>{userIdError}</FormHelperText>}
              </FormControl>
              <FormControl error={choreIdError !== ''}>
                <InputLabel id="chore-select-id">Chore</InputLabel>
                <Select
                  labelId="chore-select-id"
                  label="Chore"
                  value={choreId}
                  onChange={(e) => { setChoreId(e.target.value); if (choreIdError) validateInputs() }}
                  fullWidth
                >
                  {chores.map((chore) => {
                    return <MenuItem key={chore.id} value={chore.id}>{chore.title}</MenuItem>
                  })}
                </Select>
                {choreIdError !== '' && <FormHelperText error>{choreIdError}</FormHelperText>}
              </FormControl>
              <TextField
                label="Due Date"
                type="date"
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                InputLabelProps={{ shrink: true }}
                value={dueDate}
                onChange={(e) => { setDueDate(e.target.value || '') }}
                error={dueDateError !== ''}
                helperText={dueDateError}
                fullWidth
              />
            </Stack>
          )}
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={handleAssignChore} fullWidth disabled={isLoading} >
              Assign
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

export default observer(AssignChoreForm);

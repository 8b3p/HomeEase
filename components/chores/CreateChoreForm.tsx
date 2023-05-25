import { SetStateAction, useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Button,
  TextField,
  Drawer,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { ChoreType } from "@prisma/client";
import { useAppVM } from "@/context/Contexts";
import { ChorePostBody } from '@/pages/api/houses/[houseId]/chores'
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

interface props {
  houseId: string;
  isCreatePanelOpen: boolean;
  setCreatePanelOpen: (value: SetStateAction<boolean>) => void;
}

const CreateChoreForm = ({ houseId, isCreatePanelOpen, setCreatePanelOpen }: props) => {
  const appVM = useAppVM();
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState('')
  const [description, setDescription] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [type, setType] = useState('None')
  const [typeError, setTypeError] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    if (isCreatePanelOpen) {
      setTitle('')
      setTitleError('')
      setDescription('')
      setDescriptionError('')
      setType('None')
      setTypeError('')
    }
  }, [isCreatePanelOpen])

  const toggleCreatePanel = () => {
    setCreatePanelOpen((prevState) => !prevState);
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    if (title === '') {
      setTitleError('Title cannot be empty')
      isValid = false
    } else if (title.length > 50) {
      setTitleError('Title must be less than 50 characters')
      isValid = false
    } else {
      setTitleError('')
    }

    if (description === '') {
      setDescriptionError('Description cannot be empty')
      isValid = false
    } else if (description.length > 200) {
      setDescriptionError('Description must be less than 200 characters')
      isValid = false
    } else {
      setDescriptionError('')
    }

    if (type === 'None') {
      setTypeError('Type must be selected')
      isValid = false
    } else {
      setTypeError('')
    }

    // Perform input validation logic here
    return isValid;
  }

  const handleCreateChore = async () => {
    // Perform new chore creation logic here
    setIsLoading(true)
    if (!validateInputs()) return

    const choreType: ChoreType = type as ChoreType;

    const body: ChorePostBody = {
      title,
      description,
      type: choreType,
    };

    try {
      // Make a POST request to the API endpoint to create the chore
      const res = await fetch(`/api/houses/${houseId}/chores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      const data = await res.json();
      if (!res.ok) {
        appVM.showAlert(data.message, 'error')
      }

      console.log("Chore created:", data);
      // Reset the form fields and close the create panel
    } catch (e: any) {
      appVM.showAlert(e.message, 'error')
    }
    setIsLoading(false)
    toggleCreatePanel();
    router.push('/chores')
  };

  return (
    <Drawer anchor="right" open={isCreatePanelOpen} >
      <Stack justifyContent="space-between" alignItems="stretch" width={375} maxWidth="100vw" padding={3} height="100%">
        {isLoading ? (
          <Stack width="100%" height="100%" justifyContent="center" alignItems="center" >
            <CircularProgress />
          </Stack>) : (
          <Stack spacing={2}>
            <Typography variant="h5">Create Chore</Typography>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (titleError) validateInputs() }}
              error={titleError !== ''}
              helperText={titleError}
              fullWidth
              margin="normal"
            />
            <TextField
              multiline
              label="Description"
              value={description}
              onChange={(e) => { setDescription(e.target.value); if (descriptionError) validateInputs() }}
              error={descriptionError !== ''}
              helperText={descriptionError}
              fullWidth
              margin="normal"
            />
            <FormControl error={typeError !== ''}>
              <InputLabel id="select-id">Type</InputLabel>
              <Select
                labelId="select-id"
                label="Type"
                value={type}
                onChange={(e) => { setType(e.target.value); if (typeError) validateInputs() }}
                fullWidth
              >
                {[<MenuItem key="None" value="None">None</MenuItem>, ...Object.values(ChoreType).map((type) => {
                  return <MenuItem key={type} value={type}>{type}</MenuItem>
                })]}
              </Select>
              {typeError !== '' && <FormHelperText error>{typeError}</FormHelperText>}
            </FormControl>
          </Stack>

        )}
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={handleCreateChore} fullWidth disabled={isLoading}>
            Create
          </Button>
          <Button variant="outlined" onClick={toggleCreatePanel} fullWidth disabled={isLoading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Drawer >
  );
};

export default observer(CreateChoreForm);

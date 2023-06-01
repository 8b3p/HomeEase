import { UserPutRequestBody } from "@/pages/api/users/[userId]";
import { Check, Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, CircularProgress, Drawer, Stack, TextField, Theme, Typography, useMediaQuery } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Session } from "next-auth";
import { useState } from "react";

interface props {
  session: Session | null | undefined;
  updateUser: (body: UserPutRequestBody) => Promise<void>;
}

const UserName = ({ session, updateUser }: props) => {
  const [lastName, setLastName] = useState(session?.user.name?.split(" ")[1]);
  const [lastNameError, setLastNameError] = useState("");
  const [firstName, setFirstName] = useState(session?.user.name?.split(" ")[0]);
  const [firstNameError, setFirstNameError] = useState("");
  const [changingName, setChangingName] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateUsername = (
    value: string | null | undefined,
    whichName: "firstname" | "lastname"
  ): boolean => {
    let isValid = true;
    if (!value) {
      whichName === "firstname"
        ? setFirstNameError("Required")
        : setLastNameError("Required");
      isValid = false;
    } else if (value.trim().length === 0) {
      whichName === "firstname"
        ? setFirstNameError("Required")
        : setLastNameError("Required");
      isValid = false;
    } else if (value.trim().length < 4) {
      whichName === "firstname"
        ? setFirstNameError("Too short")
        : setLastNameError("Too short");
      isValid = false;
    } else if (value.match(/[!@#$,.%^&*]/)) {
      whichName === "firstname"
        ? setFirstNameError("No special characters")
        : setLastNameError("No special characters");
      isValid = false;
      // no capital letters
    } else {
      whichName === "firstname"
        ? setFirstNameError('')
        : setLastNameError('');
    }
    return isValid;
  };

  const submitHandler = async () => {
    if (changingName) {
      setLoading(true)
      const firstnameValidation = validateUsername(firstName!, "firstname")
      const lastnameValidation = validateUsername(lastName!, "lastname")
      if (!firstnameValidation || !lastnameValidation) {
        setLoading(false)
        return;
      }
      await updateUser({ name: { firstname: firstName?.toLowerCase()!, lastname: lastName?.toLowerCase()! } })
      setLoading(false)
    } else {
      setChangingName(true)
    }
  }

  const closeHandler = () => {
    setChangingName(false);
    setFirstName(session?.user.name?.split(' ')[0]);
    setLastName(session?.user.name?.split(' ')[1]);
    setLastNameError('')
    setFirstNameError('')
  }

  return (
    <Stack>
      <Drawer anchor="right" open={changingName} >
        <Stack justifyContent="space-between" alignItems="stretch" width={375} maxWidth="100vw" padding={3} height="100%">
          {loading ? (
            <Stack width="100%" height="100%" justifyContent="center" alignItems="center" >
              <CircularProgress />
            </Stack>) : (
            <Stack spacing={2}>
              <Typography variant="h5">Update Name</Typography>
              <TextField
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); firstNameError && validateUsername(e.target.value, "firstname"); }}
                onBlur={(e) => { validateUsername(e.target.value, "firstname") }}
                error={firstNameError ? true : false}
                helperText={firstNameError}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); lastNameError && validateUsername(e.target.value, "lastname"); }}
                onBlur={(e) => { validateUsername(e.target.value, "lastname") }}
                error={lastNameError ? true : false}
                helperText={lastNameError}
              />
            </Stack>
          )}
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={submitHandler} disabled={loading}>Submit</Button>
            <Button variant="outlined" onClick={closeHandler} disabled={loading}>Cancel</Button>
          </Stack>
        </Stack>
      </Drawer >
      <Button variant="outlined" onClick={() => setChangingName(true)}>Change</Button>
    </Stack >
  );
};

export default observer(UserName);


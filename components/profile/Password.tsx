import { UserPutRequestBody } from "@/pages/api/users/[userId]";
import { Check, Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, CircularProgress, Drawer, Stack, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Session } from "next-auth";
import { useState } from "react";

interface props {
  session: Session | null | undefined;
  updateUser: (body: UserPutRequestBody) => Promise<void>;
}

const Password = ({ session, updateUser }: props) => {
  const [changingPassword, setChangingPassword] = useState(false);
  const [password, setPassword] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState("");
  const [repeatPassword, setRepeatPassword] = useState<string | undefined>();
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (value: string | null | undefined): boolean => {
    let isValid = true;
    if (!value) {
      setPasswordError("Required");
      isValid = false;
    } else if (value.trim().length === 0) {
      setPasswordError("Required");
      isValid = false;
    } else if (value.trim().length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    } else if (!value.match(/\d/)) {
      setPasswordError("Password must contain at least one number");
      isValid = false;
    } else if (!value.match(/[A-Z]/)) {
      setPasswordError("Password must contain at least one uppercase letter");
      isValid = false;
    } else if (!value.match(/[a-z]/)) {
      setPasswordError("Password must contain at least one lowercase letter");
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
  };

  const validateRepeatPassword = (value: string | null | undefined): boolean => {
    let isValid = true;
    if (!value) {
      setRepeatPasswordError("Required");
      isValid = false;
    } else if (value.trim().length === 0) {
      setRepeatPasswordError("Required");
      isValid = false;
    } else if (value !== password) {
      setRepeatPasswordError("Passwords must match");
      isValid = false;
    } else {
      setRepeatPasswordError("");
    }
    return isValid;
  }

  const submitHandler = async () => {
    if (changingPassword) {
      setLoading(true)
      const passwordIsValid = validatePassword(password);
      const repeatPasswordIsValid = validateRepeatPassword(repeatPassword);
      if (!passwordIsValid || !repeatPasswordIsValid) {
        setLoading(false)
        return;
      }
      await updateUser({ password: password })
      setLoading(false)
    } else {
      setChangingPassword(true);
    }
  }

  const closeHandler = () => {
    setChangingPassword(false);
    setPassword('');
    setRepeatPassword('');
    setPasswordError('')
    setRepeatPasswordError('')
  }

  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
      <Drawer anchor="right" open={changingPassword} >
        <Stack justifyContent="space-between" alignItems="stretch" width={375} maxWidth="100vw" padding={3} height="100%">
          {loading ? (
            <Stack width="100%" height="100%" justifyContent="center" alignItems="center" >
              <CircularProgress />
            </Stack>) : (
            <Stack spacing={2}>
              <Typography variant="h5">Change Password</Typography>
              <TextField
                label="New Password"
                variant="outlined"
                value={password}
                onChange={(e) => { setPassword(e.target.value); passwordError && validatePassword(e.target.value); }}
                onBlur={(e) => { validatePassword(e.target.value); }}
                error={passwordError ? true : false}
                helperText={passwordError}
              />
              <TextField
                label="Repeat Password"
                variant="outlined"
                value={repeatPassword}
                onChange={(e) => { setRepeatPassword(e.target.value); repeatPasswordError && validateRepeatPassword(e.target.value); }}
                onBlur={(e) => { validateRepeatPassword(e.target.value) }}
                error={repeatPasswordError ? true : false}
                helperText={repeatPasswordError}
              />
            </Stack>
          )}
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={submitHandler} disabled={loading}>Submit</Button>
            <Button variant="outlined" onClick={closeHandler} disabled={loading}>Cancel</Button>
          </Stack>
        </Stack>
      </Drawer >
      <Button variant="text" onClick={() => setChangingPassword(true)}>Change Passwrod</Button>
    </Stack>
  );
};

export default observer(Password);

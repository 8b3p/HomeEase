import { observer } from "mobx-react-lite";
import React from "react";
import Card from "@/components/UI/Card";
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import { styled } from '@mui/material/styles'

interface props {
  submit: <T extends { username: string; password: string; email?: string }>(
    Args: T
  ) => void;
  resendAuthEmail?: (email: string) => void;
}

const StyledCard = styled(Card)(() => ({
  width: "70% !important",
  height: "70% !important",
  minWidth: "230px",
  minHeight: "300px",
  maxWidth: "330px",
  maxHeight: "400px",
}))

const StyledForm = styled("form")(({ }) => ({
  alignSelf: "center",
  display: "flex",
  rowGap: "1rem",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  height: "100%",
  width: "100%",
  "> div": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    rowGap: "1rem",
    width: "90%",
  },
  "> div > div": {
    width: "100%",
  },
  "> div > div > span": {
    width: "100%",
  },
  "> footer": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  "> footer > button": {
    marginBottom: "0.5rem",
    width: "20%",
  },
}))

const AuthForm = ({ submit, resendAuthEmail }: props) => {
  const [emailInput, setEmailInput] = React.useState<string | null>(null);
  const [passwordInput, setPasswordInput] = React.useState<string | null>(null);
  const [usernameInput, setUsernameInput] = React.useState<string | null>(null);
  const [usernameError, setUsernameError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [validate, setValidate] = React.useState<boolean>(false);
  const [islogin, setIsLogin] = React.useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState);
  };

  const validateUsername = (value: string | null): null | string => {
    if (!value) {
      setUsernameError("Username cannot be empty");
      return null;
    }
    if (value.trim().length === 0) {
      setUsernameError("Username cannot be empty");
      return null;
    }
    if (value.trim().length < 4) {
      setUsernameError("Username must be at least 6 characters long");
      return null;
    }
    setUsernameError(null);
    return value.trim().toLowerCase();
  };

  const validatePassword = (value: string | null): null | string => {
    if (!value) {
      setPasswordError("Password cannot be empty");
      return null;
    }
    if (value.trim().length === 0) {
      setPasswordError("Password cannot be empty");
      return null;
    }
    if (value.trim().length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return null;
    }
    //check if password contains at least one number
    if (!value.match(/\d/)) {
      setPasswordError("Password must contain at least one number");
      return null;
    }
    //check if password contains at least one uppercase letter
    if (!value.match(/[A-Z]/)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return null;
    }
    //check if password contains at least one lowercase letter
    if (!value.match(/[a-z]/)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return null;
    }
    setPasswordError(null);
    return value.trim();
  };

  const validateEmail = (value: string | null): null | string => {
    if (!value) {
      setEmailError("Email cannot be empty");
      return null;
    }
    if (value.trim().length === 0) {
      setEmailError("Email cannot be empty");
      return null;
    }
    //check if email is valid
    if (!value.match(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/)) {
      setEmailError("Email is not valid");
      return null;
    }
    setEmailError(null);
    return value.trim();
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    let username = validateUsername(usernameInput);
    let password = validatePassword(passwordInput);
    if (!username || !password) {
      setValidate(true);
      return;
    }
    if (islogin) {
      submit<{ username: string; password: string }>({
        username,
        password,
      });
    } else {
      let email = validateEmail(emailInput);
      if (!email) {
        setValidate(true);
        return;
      }
      submit<{ username: string; email: string; password: string }>({
        username,
        email,
        password,
      });
    }
  };

  return (
    <Stack justifyContent="center" alignItems="center" sx={{ height: "100%", width: "100%" }}>
      <StyledCard>
        <StyledForm>
          <Typography variant="h3">{islogin ? "Login" : "Signup"}</Typography>
          <div>
            <TextField
              error={usernameError ? true : false}
              helperText={usernameError}
              label='User Name'
              type='text'
              id='username'
              onChange={e => {
                setUsernameInput(e.target.value);
              }}
              onBlur={() => {
                if (validate) validateUsername(usernameInput);
              }}
            />
            {!islogin && (
              <TextField
                error={emailError ? true : false}
                helperText={emailError}
                label='Email'
                type='text'
                id='username'
                onChange={e => {
                  setEmailInput(e.target.value);
                }}
                onBlur={() => {
                  if (validate) validateEmail(emailInput);
                }}
              />
            )}
            <TextField
              error={passwordError ? true : false}
              helperText={passwordError}
              label='Password'
              type='password'
              id='password'
              onChange={e => {
                setPasswordInput(e.target.value);
              }}
              onBlur={() => {
                if (validate) validatePassword(passwordInput);
              }}
            />
          </div>
          <footer>
            <Button type='submit' variant="outlined" onClick={submitHandler}>
              {islogin ? "Login" : "Signup"}
            </Button>
            <Link href='#' sx={{ textDecoration: "none" }} onClick={switchAuthModeHandler}>
              {islogin
                ? "Dont have an account? Sign Up"
                : "Already have an account? Login"}
            </Link>
          </footer>
        </StyledForm>
      </StyledCard>
    </Stack>
  );
};

export default observer(AuthForm);

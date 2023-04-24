import { observer } from "mobx-react-lite";
import React from "react";
import Card from "@/components/UI/Card";
import { styled } from '@mui/material/styles'
import { Login } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { LoadingButton } from "@mui/lab";

interface props {
  submit: <
    T extends {
      password: string;
      email: string;
      username?: { firstname: string; lastname: string };
    }
  >(
    Args: T
  ) => void;
  resendAuthEmail?: (email: string) => void;
  loading?: boolean;
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
  },
}))

const AuthForm = ({ submit, resendAuthEmail, loading }: props) => {
  const [emailInput, setEmailInput] = React.useState<string | null>(null);
  const [passwordInput, setPasswordInput] = React.useState<string | null>(null);
  const [firstnameInput, setFirstnameInput] = React.useState<string | null>(null);
  const [lastnameInput, setLastnameInput] = React.useState<string | null>(null);
  const [firstnameError, setFirstnameError] = React.useState<string | null>(null);
  const [lastnameError, setLastnameError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [validate, setValidate] = React.useState<boolean>(false);
  const [islogin, setIsLogin] = React.useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState);
  };

  const validateUsername = (
    value: string | null,
    whichName: "firstname" | "lastname"
  ): null | string => {
    if (!value) {
      whichName === "firstname"
        ? setFirstnameError("Name cannot be empty")
        : setLastnameError("Name cannot be empty");
      return null;
    }
    if (value.trim().length === 0) {
      whichName === "firstname"
        ? setFirstnameError("Name cannot be empty")
        : setLastnameError("Name cannot be empty");
      return null;
    }
    if (value.trim().length < 4) {
      whichName === "firstname"
        ? setFirstnameError("Name must be at least 4 characters long")
        : setLastnameError("Name must be at least 4 characters long");
      return null;
    }
    //check for special characters
    if (value.match(/[!@#$%^&*]/)) {
      whichName === "firstname"
        ? setFirstnameError("Name cannot contain special characters")
        : setLastnameError("Name cannot contain special characters");
      return null;
    }
    whichName === "firstname"
      ? setFirstnameError(null)
      : setLastnameError(null);
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
    let email = validateEmail(emailInput);
    let password = validatePassword(passwordInput);
    if (!email || !password) {
      setValidate(true);
      return;
    }
    if (islogin) {
      submit<{ email: string; password: string }>({
        email,
        password,
      });
    } else {
      let firstname = validateUsername(firstnameInput, "firstname");
      let lastname = validateUsername(lastnameInput, "lastname");
      if (!firstname || !lastname) {
        setValidate(true);
        return;
      }
      submit<{
        email: string;
        password: string;
        username: { firstname: string; lastname: string };
      }>({
        email,
        password,
        username: {
          firstname,
          lastname,
        },
      });
    }
  };

  return (
    <Stack justifyContent="center" alignItems="center" sx={{ height: "100%", width: "100%" }}>
      <StyledCard>
        <StyledForm>
          <Typography variant="h3">{islogin ? "Login" : "Signup"}</Typography>
          <div>
            {!islogin && (
              <>
                <TextField
                  error={firstnameError ? true : false}
                  helperText={firstnameError}
                  label='First Name'
                  type='text'
                  id='firstname'
                  onChange={e => {
                    setFirstnameInput(e.target.value);
                  }}
                  onBlur={() => {
                    if (validate) validateUsername(firstnameInput, "firstname");
                  }}
                />
                <TextField
                  error={lastnameError ? true : false}
                  helperText={lastnameError}
                  label='Last Name'
                  type='text'
                  id='lastname'
                  onChange={e => {
                    setLastnameInput(e.target.value);
                  }}
                  onBlur={() => {
                    if (validate) validateUsername(lastnameInput, "lastname");
                  }}
                />
              </>
            )}
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
            {islogin ? (
              <LoadingButton
                size="small"
                onClick={submitHandler}
                endIcon={<Login />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                <span>Log In</span>
              </LoadingButton>
            ) : (
              <LoadingButton
                size="small"
                onClick={submitHandler}
                endIcon={<Login />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                <span>Sign Up</span>
              </LoadingButton>
            )}
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

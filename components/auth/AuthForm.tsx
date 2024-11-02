import { observer } from "mobx-react-lite";
import React from "react";
import Card from "@components/UI/Card";
import { styled } from "@mui/material/styles";
import { Login, Visibility, VisibilityOff } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { Button, CircularProgress, IconButton, InputAdornment, } from "@mui/material";

interface props {
  submit: < T extends { password: string; email: string; username?: { firstname: string; lastname: string }; } >(Args: T) => void;
  resendAuthEmail?: (email: string) => void;
  loading?: boolean;
}

export const StyledCard = styled(Card)(() => ({
  width: "70% !important",
  height: "70% !important",
  minWidth: "330px",
  minHeight: "400px",
  maxWidth: "370px",
  maxHeight: "440px",
}));

export const StyledForm = styled("form")(() => ({
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
}));

const AuthForm = ({ submit, loading }: props) => {
  const [emailInput, setEmailInput] = React.useState<string | null>(null);
  const [passwordInput, setPasswordInput] = React.useState<string | null>(null);
  const [firstnameInput, setFirstnameInput] = React.useState<string | null>(
    null
  );
  const [lastnameInput, setLastnameInput] = React.useState<string | null>(null);
  const [firstnameError, setFirstnameError] = React.useState<string | null>(
    null
  );
  const [lastnameError, setLastnameError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [validate, setValidate] = React.useState<boolean>(false);
  const [islogin, setIsLogin] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

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
    if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError("Email is not valid");
      return null;
    }
    setEmailError(null);
    return value.trim().toLowerCase();
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
    <Stack
      justifyContent='center'
      alignItems='center'
      sx={{ height: "100%", width: "100%" }}
    >
      <StyledCard>
        <StyledForm>
          <Typography variant='h3'>{islogin ? "Login" : "Signup"}</Typography>
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
              type='email'
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
              type={showPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => {
                          setShowPassword(prev => !prev);
                        }}
                        onMouseDown={e => e.preventDefault()}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              onKeyDown={e => { if (e.key == "Enter") { submitHandler(e); } }}
              id='password'
              onChange={e => { setPasswordInput(e.target.value); }}
              onBlur={() => { if (validate) validatePassword(passwordInput); }}
            />
            <Link href="/auth/forgotpassword" sx={{ textDecoration: "none", width: "100%" }}>
              Forgot Password?
            </Link>

          </div>
          <footer>
            {islogin ? (
              <Button
                size='small'
                onClick={submitHandler}
                //when enter is pressed, the button is clicked
                endIcon={<Login />}
                variant='contained'
                sx={{ textTransform: "none" }}
              >
                {loading ? <CircularProgress size={24} /> : <span>Log In</span>}
              </Button>
            ) : (
              <Button
                size='small'
                onClick={submitHandler}
                endIcon={<Login />}
                variant='contained'
                sx={{ textTransform: "none" }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <span>Sign Up</span>
                )}
              </Button>
            )}
            <Link
              href='#'
              sx={{ textDecoration: "none" }}
              onClick={switchAuthModeHandler}
            >
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

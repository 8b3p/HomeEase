import { Button, Link, makeStyles, Text } from "@fluentui/react-components";
import { InputField } from "@fluentui/react-components/unstable";
import {
  PasswordRegular,
  PersonRegular,
  MailRegular,
} from "@fluentui/react-icons";
import { observer } from "mobx-react-lite";
import React from "react";
import Card from "@/components/UI/Card";

interface props {
  submit: <T extends { username: string; password: string; email?: string }>(
    Args: T
  ) => void;
  resendAuthEmail?: (email: string) => void;
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  card: {
    width: "70% !important",
    height: "70% !important",
    minWidth: "230px",
    minHeight: "300px",
    maxWidth: "330px",
    maxHeight: "400px",
  },
  formControl: {
    display: "flex",
    alignSelf: "center",
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
  },
});

const AuthForm = ({ submit, resendAuthEmail }: props) => {
  const [emailInput, setEmailInput] = React.useState<string | null>(null);
  const [passwordInput, setPasswordInput] = React.useState<string | null>(null);
  const [usernameInput, setUsernameInput] = React.useState<string | null>(null);
  const [usernameError, setUsernameError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [validate, setValidate] = React.useState<boolean>(false);
  const [islogin, setIsLogin] = React.useState(true);
  const classes = useStyles();

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
    //check for special characters
    if (value.match(/[!@#$%^&*]/)) {
      setUsernameError("Username must not contain any special character");
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
    //check for special characters
    if (!value.match(/[!@#$%^&*]/)) {
      setPasswordError("Password must contain at least one special character");
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
    <div className={classes.container}>
      <Card className={classes.card}>
        <form className={classes.formControl}>
          <Text size={800}>{islogin ? "Login" : "Signup"}</Text>
          <div>
            <InputField
              validationMessage={usernameError}
              validationState={usernameError ? "error" : "success"}
              appearance='underline'
              placeholder='User Name'
              contentBefore={<PersonRegular />}
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
              <InputField
                validationMessage={emailError}
                validationState={emailError ? "error" : "success"}
                appearance='underline'
                contentBefore={<MailRegular />}
                placeholder='Email'
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
            <InputField
              validationMessage={passwordError}
              validationState={passwordError ? "error" : "success"}
              appearance='underline'
              placeholder='Password'
              contentBefore={<PasswordRegular />}
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
            <Button appearance='primary' type='submit' onClick={submitHandler}>
              {islogin ? "Login" : "Signup"}
            </Button>
            <Link as='a' href='#' onClick={switchAuthModeHandler}>
              {islogin
                ? "Dont have an account? Sign Up"
                : "Already have an account? Login"}
            </Link>
          </footer>
        </form>
      </Card>
    </div>
  );
};

export default observer(AuthForm);

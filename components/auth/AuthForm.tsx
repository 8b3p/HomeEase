import {
  Button,
  Link,
  makeStyles,
  Text,
  shorthands,
  Spinner,
} from "@fluentui/react-components";
import { InputField } from "@fluentui/react-components/unstable";
import {
  PasswordRegular,
  PersonRegular,
  MailRegular,
} from "@fluentui/react-icons";
import { observer } from "mobx-react-lite";
import React from "react";
import Card from "@/components/UI/Card";

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

const AuthForm = ({ submit, resendAuthEmail, loading }: props) => {
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
  const classes = useStyles();

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
    <div className={classes.container}>
      <Card className={classes.card}>
        <form className={classes.formControl}>
          <Text size={800}>{islogin ? "Login" : "Signup"}</Text>
          <div>
            {!islogin && (
              <>
                <InputField
                  validationMessage={firstnameError}
                  validationState={firstnameError ? "error" : "success"}
                  appearance='underline'
                  placeholder='First Name'
                  contentBefore={<PersonRegular />}
                  type='text'
                  id='firstname'
                  onChange={e => {
                    setFirstnameInput(e.target.value);
                  }}
                  onBlur={() => {
                    if (validate) validateUsername(firstnameInput, "firstname");
                  }}
                />
                <InputField
                  validationMessage={lastnameError}
                  validationState={lastnameError ? "error" : "success"}
                  appearance='underline'
                  placeholder='Last Name'
                  contentBefore={<PersonRegular />}
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
              {loading ? (
                <Spinner size='tiny' appearance='inverted' />
              ) : islogin ? (
                "Login"
              ) : (
                "Signup"
              )}
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

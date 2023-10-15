import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Dialog } from "@mui/material";

const Login = ({ open, setOpen = () => {} }) => {
  const [error, isError] = useState(false);
  const [isdisabled, setIsDisabled] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    loginData.email && loginData.password
      ? setIsDisabled(false)
      : setIsDisabled(true);
  }, [loginData]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(loginData);
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>Login Form</DialogTitle>
      <Box
        display={"flex"}
        flexDirection={"column"}
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "33ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={(e) => submitHandler(e)}
      >
        <div className="textfields">
          <TextField
            error={error}
            id="email"
            label="Email"
            defaultValue={loginData.email}
            type="email"
            onChange={(e) => {
              setLoginData({ ...loginData, email: e.target.value });
            }}
          />
          <TextField
            error={error}
            id="outlined-error-helper-text"
            label="password"
            defaultValue={loginData.password}
            type="password"
            helperText={error ? "Incorrect entry" : ""}
            onChange={(e) => {
              setLoginData({ ...loginData, password: e.target.value });
            }}
          />
        </div>

        <Box
          textAlign={"center"}
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <div className="buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {}}
              disabled={isdisabled}
              type="submit"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {}}
              disabled={true}
              type="submit"
            >
              Signup with Google ACcount
            </Button>
          </div>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Login;

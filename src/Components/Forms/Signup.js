import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import { Dialog } from "@mui/material";
import { Button } from "@mui/material";

import "./Forms.css";

const Signup = ({ open, setOpen = () => {} }) => {
  const [error, isError] = useState(false);
  const [isdisabled, setIsDisabled] = useState(true);
  const [signupData, setsignupData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    signupData.fname && signupData.password
      ? setIsDisabled(false)
      : setIsDisabled(true);
  }, [signupData]);

  const submitHandler = (e) => {
    e.preventDefault();
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>Sign Up Form</DialogTitle>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "33ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={(event) => submitHandler(event)}
      >
        <div className="textfields">
          <TextField
            error={error}
            id="fname"
            label="First Name"
            defaultValue={signupData.fname}
            onChange={(e) => {
              setsignupData({ ...signupData, fname: e.target.value });
            }}
          />
          <TextField
            error={error}
            id="lastname"
            label="Last Name"
            defaultValue={signupData.lname}
            helperText={error ? "Incorrect entry" : ""}
            onChange={(e) => {
              setsignupData({ ...signupData, lname: e.target.value });
            }}
          />
          <TextField
            error={error}
            id="email"
            label="Email"
            type="email"
            defaultValue={signupData.email}
            helperText={error ? "Incorrect entry" : ""}
            onChange={(e) => {
              setsignupData({ ...signupData, email: e.target.value });
            }}
          />
          <TextField
            error={error}
            id="password"
            label="Password"
            type="password"
            helperText={error ? "Incorrect entry" : ""}
            defaultValue={signupData.password}
            onChange={(e) => {
              setsignupData({ ...signupData, password: e.target.value });
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
              Signup
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

export default Signup;

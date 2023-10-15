import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Login from "../Components/Forms/Login";
import Signup from "../Components/Forms/Signup";
import Guest from "../Components/Forms/Guest";

const Blackbg = (props) => {
  const { open, setOpen = () => {}, pgName } = props;
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      // onClick={() => {
      //   setOpen(false);
      // }}
    >
      {
        pgName === "login" ? (
          <Login setOpen={setOpen} open={open} />
        ) : pgName === "signup" ? (
          <Signup setOpen={setOpen} open={open} />
        ) : null
        //     (
        //   <Guest setOpen={setOpen} open={open} />
        // )
      }
    </Backdrop>
  );
};

export default React.memo(Blackbg);

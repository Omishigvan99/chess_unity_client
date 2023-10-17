import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { MenuItem, TextField, List } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RightPanelView = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [btnName, setBtnName] = useState("");

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="right-inner">
      <Button
        id="playasguest"
        variant="contained"
        color="inherit"
        onClick={(e) => {
          handleButtonClick(e);
          setBtnName("playasguest");
        }}
      >
        Play as Guest
      </Button>
      <Button
        id="playwithfrnd"
        variant="contained"
        color="inherit"
        onClick={(e) => {
          handleButtonClick(e);
          setBtnName("playwithfrnd");
        }}
        aria-controls={anchorEl ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
      >
        Play with friend
      </Button>

      <RightPanelOptions
        anchorEl={anchorEl}
        handleClose={handleClose}
        btnName={btnName}
      />
    </div>
  );
};

export default RightPanelView;

const RightPanelOptions = ({ anchorEl, handleClose, btnName }) => {
  const navigate = useNavigate();

  const [inviteLink, setInviteLink] = useState("");
  const [roomName, setRoomName] = useState("");
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "playwithfrnd",
      }}
    >
      <MenuItem
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        <TextField
          id="joinroom"
          label={`${
            btnName === "playwithfrnd" ? "Enter Invite Link" : "Enter Room Name"
          }`}
          defaultValue={`${btnName === "playwithfrnd" ? inviteLink : roomName}`}
          type="text"
          fullWidth
          onChange={(e) => {
            btnName === "playwithfrnd"
              ? setInviteLink(e.target.value)
              : setRoomName(e.target.value);
          }}
        />
        <Button
          style={{ alignItems: "center" }}
          id="joinroom"
          variant="contained"
          color="inherit"
          onClick={(e) => {
            btnName === "playwithfrnd"
              ? navigate(inviteLink)
              : navigate(roomName);
            console.log(
              `${btnName === "playwithfrnd" ? inviteLink : roomName}`
            );

            handleClose();
          }}
        >
          {`${btnName === "playwithfrnd" ? "Invite" : "Join Room"}`}{" "}
        </Button>
      </MenuItem>
    </Menu>
  );
};

// {
//   btnName === "playwithfrnd" ? (
//     <MenuItem>
//       <TextField
//         id="invitelink"
//         label="Invite"
//         defaultValue={inviteLink}
//         type="text"
//         fullWidth
//         onChange={(e) => {
//           setInviteLink(e.target.value);
//         }}
//       />
//     </MenuItem>
//   ) : (
//     <MenuItem style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//       <TextField
//         id="joinroom"
//         label="Enter Room Name"
//         defaultValue={roomName}
//         type="text"
//         fullWidth
//         onChange={(e) => {
//           setRoomName(e.target.value);
//         }}
//       />
//       <Button
//         style={{ alignItems: "center" }}
//         id="joinroom"
//         variant="contained"
//         color="inherit"
//         onClick={(e) => {
//           console.log(roomName);
//           handleClose();
//         }}
//       >
//         Join Room
//       </Button>
//     </MenuItem>
//   );
// }

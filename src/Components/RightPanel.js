import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { MenuItem, TextField, List } from "@mui/material";

const RightPanel = () => {
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

export default RightPanel;

const RightPanelOptions = ({ anchorEl, handleClose, btnName }) => {
  const [inviteLink, setInviteLink] = useState("");
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
      {btnName === "playwithfrnd" ? (
        <MenuItem>
          <TextField
            id="invitelink"
            label="Invite"
            defaultValue={inviteLink}
            type="text"
            fullWidth
            onChange={(e) => {
              setInviteLink(e.target.value);
            }}
          />
        </MenuItem>
      ) : (
        <div style={{ display: "flex", flexDirection: "row", gap: "50" }}>
          <MenuItem onClick={handleClose}>Join</MenuItem>
          <MenuItem onClick={handleClose}>abc</MenuItem>
        </div>
      )}
    </Menu>
  );
};

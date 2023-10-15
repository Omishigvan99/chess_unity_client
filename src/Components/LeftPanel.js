import React, { useState } from "react";
import { Button } from "@mui/material";
import { panelOptions, regOptions } from ".";
import { useNavigate } from "react-router-dom";

const LeftPanel = (props) => {
  const navigate = useNavigate();

  const { setOpen = () => {}, setPageName = () => {} } = props;
  const [showPanel, setShowPanel] = useState({
    state: "",
    id: 1,
  });

  return (
    <div
      className="left-panel"
      onMouseLeave={() => {
        setShowPanel({ ...showPanel, state: false });
      }}
    >
      <span style={{ color: "#fff" }}>| Chess Unity</span>
      <div className="left-panel-inner">
        {panelOptions.map((e) => {
          return (
            <div
              key={e.id}
              className="lpanel-option"
              onMouseOver={() => {
                setShowPanel({ state: true, id: e.id });
              }}
            >
              <p>{e.name}</p>
            </div>
          );
        })}
        {showPanel.state && (
          <LeftOptions data={panelOptions} id={showPanel.id} />
        )}
      </div>
      <div className="buttons">
        {regOptions?.map((e) => {
          return (
            <Button
              variant="contained"
              color="inherit"
              key={e.key}
              onClick={() => {
                setOpen(true);
                setPageName(e.name);
                let name =
                  e.name === "sign up" ? e.name.replace(/\s+/g, "") : e.name;
                navigate(name);
              }}
            >
              {e.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default LeftPanel;

const LeftOptions = (props) => {
  const { data, id } = props;
  return (
    <div
      style={{
        position: "absolute",
        zIndex: "1",
        top: "30px",
        backgroundColor: "rgb(254, 254, 254) ",
        height: "auto",
        left: "200px",
        width: "100px",
        borderRadius: "8px",
        textAlign: "center",
        cursor: "pointer",
      }}
      className="left-panel-inner"
    >
      {data?.map((panel) => {
        return panel?.id === id ? (
          <div key={panel.id}>
            {panel.options.map((e) => {
              return (
                <div className="optionDiv" key={e.id}>
                  <p>{e}</p>
                </div>
              );
            })}
          </div>
        ) : null;
      })}
    </div>
  );
};

import React, { useState } from "react";
import chessLogo from "../Assets/chessLogo.png";

const LeftPanel = () => {
  const [showPanel, setShowPanel] = useState({
    state: "",
    id: 1,
  });
  const panelOptions = [
    {
      id: 1,
      name: "Puzzle",
      options: ["Play", "Computer", "Tournaments"],
    },
    {
      id: 2,
      name: "Puzzles",
      options: [
        "Puzzle",
        "Puzzle Rush",
        "Puzzle Battle",
        "Daily Puzzle",
        "Custom Puzzle",
      ],
    },
    {
      id: 3,
      name: "News",
      options: ["News", "Chess Ranking", "Top Player", "Articles"],
    },
    {
      id: 4,
      name: "Tutorials",
      options: [],
    },
  ];

  return (
    <div className="left-panel">
      <span style={{ color: "#fff" }}>| Chess Unity</span>
      <div
        className="left-panel-inner"
        onMouseLeave={() => {
          setShowPanel({ ...showPanel, state: false });
        }}
      >
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
      </div>
      {showPanel.state && <LeftOptions data={panelOptions} id={showPanel.id} />}
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
        backgroundColor: "#d0cdf9 ",
        height: "auto",
        left: "200px",
        width: "90px",
      }}
      className="left-panel-inner"
    >
      {data?.map((panel) => {
        return panel?.id === id ? (
          <div key={panel.id}>
            {panel.options.map((e) => {
              return (
                <div key={e.id}>
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

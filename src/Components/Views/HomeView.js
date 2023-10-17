import React from "react";
import ChessBoard from "../ChessBoard";
import RightPanelView from "./RightPanelView";
const HomeView = () => {
  return (
    <div className="right-pannel">
      <ChessBoard
        FEN={"r1bqk1nr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 5"}
      />
      <RightPanelView />
    </div>
  );
};

export default HomeView;

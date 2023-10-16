import React from "react";
import ChessBoard from "../ChessBoard";
import RightPanel from "../RightPanel";

const RightSide = () => {
  return (
    <div className="right-pannel">
      <ChessBoard
        FEN={"r1bqk1nr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 5"}
      />
      <RightPanel />
    </div>
  );
};

export default RightSide;

import React, { useEffect } from "react";
import { useState } from "react";
import { Chess } from "../utilities/ChessUtility";
import Square from "./Square";

const ChessBoard = ({ FEN }) => {
    const [chessState, setChessState] = useState({
        ...Chess.getInitialChessState(),
    });

    //effect for rendering UI when FEN string changes
    useEffect(() => {
        setChessState((prevChessState) => {
            return { ...Chess.fenParser(FEN) };
        });
    }, [FEN]);

    return (
        <>
            <svg
                id="chessboard"
                width="100%"
                height="100%"
                viewBox="0 0 800 800"
            >
                <rect
                    id="boundary"
                    key={"boundary"}
                    x={0}
                    y={0}
                    height={800}
                    width={800}
                    fill="#999"
                ></rect>
                {chessState.ranks.map((rank, row_index) => {
                    return rank.map((square, col_index) => {
                        return (
                            <Square
                                key={"" + col_index + row_index}
                                col_index={col_index}
                                row_index={row_index}
                                payload={square}
                            ></Square>
                        );
                    });
                })}
            </svg>
        </>
    );
};

export default ChessBoard;

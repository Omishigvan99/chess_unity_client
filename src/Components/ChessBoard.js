import React, { useEffect } from "react";
import { useState } from "react";
import { Chess } from "../utilities/ChessUtility";

const ChessBoard = ({ FEN }) => {
    const [chessState, setChessState] = useState({
        ...Chess.getInitialChessState(),
    });

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
                            <>
                                {(row_index + col_index) % 2 === 0 ? (
                                    <rect
                                        id={"" + row_index + col_index}
                                        key={"square" + row_index + col_index}
                                        x={col_index * 100}
                                        y={row_index * 100}
                                        height={100}
                                        width={100}
                                        fill="#ccc"
                                    />
                                ) : (
                                    <rect
                                        id={"" + row_index + col_index}
                                        key={"" + row_index + col_index}
                                        x={col_index * 100}
                                        y={row_index * 100}
                                        height={100}
                                        width={100}
                                        fill="#999"
                                    />
                                )}
                            </>
                        );
                    });
                })}
            </svg>
        </>
    );
};

export default ChessBoard;

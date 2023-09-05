import React from "react";
import * as Piece from "./Pieces";

function Sqaure({ col_index, row_index, payload }) {
    //getting respective Piece Component based on payload
    let piece = getPeice(payload, col_index, row_index);
    return (
        <>
            <rect
                x={col_index * 100}
                y={row_index * 100}
                height={100}
                width={100}
                fill={
                    (row_index + col_index) % 2 === 0 ? "#F0D9B5 " : "#8B5D3E"
                }
            />
            {piece}
        </>
    );
}

//returns a Piece component
function getPeice(payload, col_index, row_index) {
    col_index = col_index * 100;
    row_index = row_index * 100;
    switch (payload) {
        case "k":
            return (
                <Piece.BlackKing x={col_index} y={row_index}></Piece.BlackKing>
            );
        case "q":
            return (
                <Piece.BlackQueen
                    x={col_index}
                    y={row_index}
                ></Piece.BlackQueen>
            );
        case "b":
            return (
                <Piece.BlackBishop
                    x={col_index}
                    y={row_index}
                ></Piece.BlackBishop>
            );
        case "n":
            return (
                <Piece.BlackKnight
                    x={col_index}
                    y={row_index}
                ></Piece.BlackKnight>
            );
        case "r":
            return (
                <Piece.BlackRook x={col_index} y={row_index}></Piece.BlackRook>
            );
        case "p":
            return (
                <Piece.BlackPawn x={col_index} y={row_index}></Piece.BlackPawn>
            );
        case "K":
            return (
                <Piece.WhiteKing x={col_index} y={row_index}></Piece.WhiteKing>
            );
        case "Q":
            return (
                <Piece.WhiteQueen
                    x={col_index}
                    y={row_index}
                ></Piece.WhiteQueen>
            );
        case "B":
            return (
                <Piece.WhiteBishop
                    x={col_index}
                    y={row_index}
                ></Piece.WhiteBishop>
            );
        case "N":
            return (
                <Piece.WhiteKnight
                    x={col_index}
                    y={row_index}
                ></Piece.WhiteKnight>
            );
        case "R":
            return (
                <Piece.WhiteRook x={col_index} y={row_index}></Piece.WhiteRook>
            );
        case "P":
            return (
                <Piece.WhitePawn x={col_index} y={row_index}></Piece.WhitePawn>
            );
        default:
            return null;
    }
}

export default Sqaure;

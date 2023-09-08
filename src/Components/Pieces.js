import React from "react";

function WhiteKing({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/w-king.svg"}
            ></image>
        </>
    );
}

function WhiteQueen({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/w-queen.svg"}
            ></image>
        </>
    );
}

function WhiteBishop({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/w-bishop.svg"}
            ></image>
        </>
    );
}

function WhiteKnight({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/w-knight.svg"}
            ></image>
        </>
    );
}

function WhiteRook({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/w-rook.svg"}
            ></image>
        </>
    );
}

function WhitePawn({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/w-pawn.svg"}
            ></image>
        </>
    );
}

function BlackKing({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/b-king.svg"}
            ></image>
        </>
    );
}

function BlackQueen({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/b-queen.svg"}
            ></image>
        </>
    );
}

function BlackBishop({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/b-bishop.svg"}
            ></image>
        </>
    );
}

function BlackKnight({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/b-knight.svg"}
            ></image>
        </>
    );
}

function BlackRook({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/b-rook.svg"}
            ></image>
        </>
    );
}

function BlackPawn({ x, y, className }) {
    return (
        <>
            <image
                className={className}
                x={x}
                y={y}
                height={100}
                width={100}
                href={process.env.PUBLIC_URL + "/defaultPieces/b-pawn.svg"}
            ></image>
        </>
    );
}

export {
    WhiteKing,
    WhiteQueen,
    WhiteBishop,
    WhiteKnight,
    WhiteRook,
    WhitePawn,
    BlackKing,
    BlackQueen,
    BlackBishop,
    BlackKnight,
    BlackRook,
    BlackPawn,
};

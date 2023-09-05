import React from "react";

function Sqaure({ col_index, row_index }) {
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
        </>
    );
}

export default Sqaure;

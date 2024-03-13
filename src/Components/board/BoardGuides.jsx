import React from 'react'
import { reverseArray } from '../../utils/chess'

let ranks = [1, 2, 3, 4, 5, 6, 7, 8]
let files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

function Text({ children, height, foregroundColor }) {
    return (
        <>
            <svg viewBox="0 0 24 24" height={height}>
                <text x="8" y="18" fill={foregroundColor} fontSize="14">
                    {children}
                </text>
            </svg>
        </>
    )
}

export default function BoardGuides({
    children,
    backgroundColor,
    foregroundColor,
    flip,
}) {
    return (
        <>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '4% auto 4%',
                    gridTemplateRows: '4% auto 4%',
                    aspectRatio: '1/1',
                }}
            >
                <div
                    className="blank"
                    style={{
                        backgroundColor: backgroundColor,
                    }}
                ></div>
                <div
                    className="top"
                    style={{
                        backgroundColor: backgroundColor,
                        display: 'flex',
                        gridColumn: '2 / 3',
                    }}
                >
                    {(flip ? reverseArray(files) : files).map((file) => {
                        return (
                            <span key={file} style={styles.guideBarItems}>
                                <Text
                                    foregroundColor={foregroundColor}
                                    height={'100%'}
                                >
                                    {file}
                                </Text>
                            </span>
                        )
                    })}
                </div>
                <div
                    className="blank"
                    style={{
                        backgroundColor: backgroundColor,
                    }}
                ></div>
                <div
                    className="left"
                    style={{
                        backgroundColor: backgroundColor,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {(flip ? ranks : reverseArray(ranks)).map((rank) => {
                        return (
                            <span key={rank} style={styles.guideBarItems}>
                                <Text foregroundColor={foregroundColor}>
                                    {rank}
                                </Text>
                            </span>
                        )
                    })}
                </div>
                {children}
                <div
                    className="right"
                    style={{
                        backgroundColor: backgroundColor,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {(flip ? reverseArray(ranks) : ranks).map((rank) => {
                        return (
                            <span key={rank} style={styles.guideBarItems}>
                                <Text foregroundColor={foregroundColor}>
                                    {rank}
                                </Text>
                            </span>
                        )
                    })}
                </div>
                <div
                    className="blank"
                    style={{
                        backgroundColor: backgroundColor,
                    }}
                ></div>
                <div
                    className="bottom"
                    style={{
                        backgroundColor: backgroundColor,
                        display: 'flex',
                    }}
                >
                    {(flip ? reverseArray(files) : files).map((file) => {
                        return (
                            <span key={file} style={styles.guideBarItems}>
                                <Text
                                    foregroundColor={foregroundColor}
                                    height={'100%'}
                                >
                                    {file}
                                </Text>
                            </span>
                        )
                    })}
                </div>
                <div
                    className="blank"
                    style={{
                        backgroundColor: backgroundColor,
                    }}
                ></div>
            </div>
        </>
    )
}

let styles = {
    guideBarItems: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
}

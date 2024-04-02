import { Spin } from 'antd'

function Loading({ style, isloading, children }) {
    return (
        <>
            {isloading ? (
                <div
                    style={{
                        height: '100%',
                        minHeight: '10rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...style,
                    }}
                >
                    <Spin size="large" />
                </div>
            ) : (
                children
            )}
        </>
    )
}

export default Loading

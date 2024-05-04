import { Spin } from 'antd'

function Loading({ style, isLoading, children }) {
    return (
        <>
            {isLoading ? (
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

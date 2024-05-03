// Importing necessary components and hooks from 'antd' and 'react'
// 'ModalContext' is imported from '../../context/modal.context'
// 'UserOutlined' is an icon from '@ant-design/icons'
import {
    Avatar,
    Badge,
    Button,
    Card,
    Divider,
    Modal,
    Space,
    Typography,
    theme,
} from 'antd'
import { useContext } from 'react'
import { ModalContext } from '../../context/modal.context'
import { UserOutlined } from '@ant-design/icons'

// The 'GameResult' component uses the 'ModalContext' to get the state of the game result and the function to open/close the game result modal.
// It also uses the 'theme' from 'antd' to get the color token.
function GameResult() {
    const { openGameResult, openGameResultModal } = useContext(ModalContext)
    const {
        token: { green },
    } = theme.useToken()

    // The 'GameResult' component returns a 'Modal' that is open when 'openGameResult.open' is true.
    // The modal displays the game result ('You Won', 'Draw', or 'You Lose') and the avatars of the player and the opponent.
    // If the player wins, a 'Winner' badge is displayed on the player's avatar.
    // If the player loses, the 'Winner' badge is displayed on the opponent's avatar.
    // The modal also has 'Rematch' and 'Quit' buttons.
    return (
        <Modal
            open={openGameResult.open}
            footer={null}
            onCancel={() => {
                openGameResultModal(false, {
                    type: null,
                    color: null,
                    playerImageUrl: null,
                    opponentImageUrl: null,
                    message: null,
                })
            }}
        >
            <Space
                style={{
                    width: '100%',
                }}
                direction="vertical"
                align="center"
            >
                <Typography.Title
                    level={2}
                    style={{
                        ...styles.title,
                    }}
                >
                    {openGameResult.type === 'win'
                        ? openGameResult.message
                        : null}
                    {openGameResult.type === 'draw'
                        ? openGameResult.message
                        : null}
                    {openGameResult.type === 'loss'
                        ? openGameResult.message
                        : null}
                </Typography.Title>
                <Space>
                    {openGameResult.type === 'win' ? (
                        <Badge.Ribbon text="Winner" color={green}>
                            <PlayerAvatar
                                color={openGameResult.color}
                                src={openGameResult.player.imageUrl}
                                displayPeiceBadge={true}
                            ></PlayerAvatar>
                        </Badge.Ribbon>
                    ) : (
                        <PlayerAvatar
                            color={openGameResult.color}
                            src={openGameResult.player.imageUrl}
                            displayPeiceBadge={false}
                        ></PlayerAvatar>
                    )}
                    <Divider type="vertical"></Divider>
                    {openGameResult.type === 'loss' ? (
                        <Badge.Ribbon text="Winner" color={green}>
                            <PlayerAvatar
                                color={openGameResult.color}
                                src={openGameResult.opponent.imageUrl}
                                displayPeiceBadge={true}
                            ></PlayerAvatar>
                        </Badge.Ribbon>
                    ) : (
                        <PlayerAvatar
                            color={openGameResult.color}
                            src={openGameResult.opponent.imageUrl}
                            displayPeiceBadge={false}
                        ></PlayerAvatar>
                    )}
                </Space>
                <Space
                    style={{
                        ...styles.buttonContainer,
                    }}
                    split
                >
                    <Button type="primary">Rematch</Button>
                    <Button danger>Quit</Button>
                </Space>
            </Space>
        </Modal>
    )
}

// Exporting the 'GameResult' component
export default GameResult

// 'PeiceBadge' is a component that displays an image of a king piece of the given color.
function PeiceBadge({ color }) {
    return (
        <div
            style={{
                ...styles.badgeContainer,
            }}
        >
            <Avatar src={`/images/${color}-king.png`}></Avatar>
        </div>
    )
}

// 'PlayerAvatar' is a component that displays an avatar of the player.
// If 'displayPeiceBadge' is true, it also displays the 'PeiceBadge'.
function PlayerAvatar({ color, displayPeiceBadge, src }) {
    return (
        <Card
            style={{
                ...styles.avatarCards,
            }}
        >
            <Avatar
                size={110}
                icon={<UserOutlined />}
                src={src}
                shape="square"
            ></Avatar>
            {displayPeiceBadge ? <PeiceBadge color={color}></PeiceBadge> : null}
        </Card>
    )
}

// 'styles' is an object that contains the styles for the components.
const styles = {
    avatarCards: {
        position: 'relative',
        height: '10rem',
        aspectRatio: 1,
        display: 'grid',
        placeItems: 'center',
    },
    title: {
        margin: '1rem',
    },
    buttonContainer: {
        marginTop: '1.25rem',
    },
    badgeContainer: {
        position: 'absolute',
        bottom: -15,
        right: -15,
        height: '3rem',
        aspectRatio: 1,
    },
}

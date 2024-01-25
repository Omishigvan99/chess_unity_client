import { grey } from '@ant-design/colors'

// Get colors palette
function getColors(color, name) {
    let temp = {}
    color.forEach((element, index) => {
        temp[`${name}-${index}`] = element
    })
    return temp
}

// Global colors
export const globalColors = {
    grey: {
        ...getColors(grey, 'grey'),
    },
}

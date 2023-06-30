import {
    Direction,
    rotateDirectionLeft,
    rotateDirectionRight,
} from './direction'

export class Road {
    directions: Direction[]
    sprite: number

    constructor(sprite: number, directions: Direction[]) {
        this.sprite = sprite
        this.directions = directions
    }

    public rotateLeft(): Road {
        return this.rotate(rotateDirectionLeft)
    }

    public rotateRight(): Road {
        return this.rotate(rotateDirectionRight)
    }
    private rotate(fn: (d: Direction) => Direction): Road {
        if (!this.directions.length) {
            return this
        }
        const directions = this.directions.map(fn)
        return getRoadFromDirection(directions, true)
    }
    canRotate() {
        return this.directions.length > 0
    }
}

export const BOTTOM_RIGHT = new Road(13, [Direction.DOWN, Direction.RIGHT])
export const BOTTOM_LEFT = new Road(14, [Direction.DOWN, Direction.LEFT])
export const LEFT = new Road(15, [Direction.LEFT])
export const TOP = new Road(16, [Direction.UP])

export const TOP_RIGHT = new Road(29, [Direction.UP, Direction.RIGHT])
export const TOP_LEFT = new Road(30, [Direction.UP, Direction.LEFT])
export const BOTTOM = new Road(31, [Direction.DOWN])
export const RIGHT = new Road(32, [Direction.RIGHT])

export const VERTICAL = new Road(45, [Direction.UP, Direction.DOWN])
export const HORIZONTAL = new Road(46, [Direction.LEFT, Direction.RIGHT])
export const LEFT_TOP_RIGHT = new Road(47, [
    Direction.LEFT,
    Direction.UP,
    Direction.RIGHT,
])
export const LEFT_TOP_BOTTOM = new Road(48, [
    Direction.LEFT,
    Direction.UP,
    Direction.DOWN,
])

export const CROSS = new Road(62, [
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
])
export const RIGHT_TOP_BOTTOM = new Road(63, [
    Direction.RIGHT,
    Direction.UP,
    Direction.DOWN,
])
export const LEFT_DOWN_RIGHT = new Road(64, [
    Direction.LEFT,
    Direction.DOWN,
    Direction.RIGHT,
])
export const UNKNOWN = new Road(0, [])

export const TREE_1 = new Road(24, [])
export const TREE_2 = new Road(40, [])
export const STONE_1 = new Road(55, [])
export const STONE_2 = new Road(56, [])
export const STONE_3 = new Road(57, [])
export const HOUSE_1 = new Road(27, [])
export const HOUSE_2 = new Road(28, [])
export const HERB_1 = new Road(8, [])
export const FLOWER_1 = new Road(9, [])

export const allRoads = [
    HOUSE_1,
    HOUSE_2,
    CROSS,
    LEFT,
    TOP,
    RIGHT,
    BOTTOM,
    TOP_RIGHT,
    TOP_LEFT,
    BOTTOM_RIGHT,
    BOTTOM_LEFT,
    VERTICAL,
    HORIZONTAL,
    LEFT_TOP_RIGHT,
    LEFT_TOP_BOTTOM,
    RIGHT_TOP_BOTTOM,
    LEFT_DOWN_RIGHT,
    TREE_1,
    TREE_2,
    STONE_1,
    STONE_2,
    STONE_3,
    // HERB_1,
    FLOWER_1,
    FLOWER_1,
    FLOWER_1,
    FLOWER_1,
    FLOWER_1,
    FLOWER_1,
    FLOWER_1,
]

export const getRoadFromDirection = (
    directions: Direction[],
    strict = false
): Road => {
    const availables = allRoads.filter(
        (road) =>
            directions.every((d) => road.directions.includes(d)) &&
            (!strict || road.directions.length === directions.length)
    )
    if (availables.length == 0) {
        // no road available
        return UNKNOWN
    }
    return availables[Math.floor(Math.random() * availables.length)]
}

export const getRoadFromSprite = (sprite: number): Road => {
    const road = allRoads.find((road) => road.sprite === sprite)
    if (road) {
        return road
    }
    // no road available
    return UNKNOWN
}

export const getRandomRoad = (): Road => {
    const offset = 7
    return allRoads[0 | (Math.random() * (allRoads.length - offset) + offset)]
}

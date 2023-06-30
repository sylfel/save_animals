export enum Direction {
    UP = 'up',
    RIGHT = 'right',
    DOWN = 'down',
    LEFT = 'left',
}

export const allDirection = [
    Direction.UP,
    Direction.RIGHT,
    Direction.DOWN,
    Direction.LEFT,
]

export const oppositeDirection = (direction: Direction): Direction => {
    switch (direction) {
        case Direction.UP:
            return Direction.DOWN
        case Direction.RIGHT:
            return Direction.LEFT
        case Direction.DOWN:
            return Direction.UP
        case Direction.LEFT:
            return Direction.RIGHT
    }
}

export const rotateDirectionRight = (direction: Direction): Direction => {
    switch (direction) {
        case Direction.UP:
            return Direction.RIGHT
        case Direction.RIGHT:
            return Direction.DOWN
        case Direction.DOWN:
            return Direction.LEFT
        case Direction.LEFT:
            return Direction.UP
    }
}

export const rotateDirectionLeft = (direction: Direction): Direction => {
    switch (direction) {
        case Direction.UP:
            return Direction.LEFT
        case Direction.RIGHT:
            return Direction.UP
        case Direction.DOWN:
            return Direction.RIGHT
        case Direction.LEFT:
            return Direction.DOWN
    }
}

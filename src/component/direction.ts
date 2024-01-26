import { Vector } from 'kontra'

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

export const UP2 = Vector(0, -1)
export const RIGHT2 = Vector(1, 0)
export const DOWN2 = Vector(0, 1)
export const LEFT2 = Vector(-1, 0)

export const Directions = [UP2, RIGHT2, DOWN2, LEFT2]

export const getDirection = (v: Pick<Vector, 'x' | 'y'>): Vector => {
    if (v.x == 0) {
        return v.y == UP2.y ? UP2 : DOWN2
    }
    return v.x == LEFT2.x ? LEFT2 : RIGHT2
}

export const directionToString = (v: Vector): String => {
    const d = getDirection(v)
    if (d == UP2) {
        return 'up'
    }
    if (d == DOWN2) {
        return 'down'
    }
    if (d == LEFT2) {
        return 'left'
    }
    return 'right'
}

export const rotateRight = (v: Vector): Vector => {
    if (v.x == 0) {
        return v.y == UP2.y ? RIGHT2 : LEFT2
    }
    return v.x == LEFT2.x ? UP2 : DOWN2
}

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

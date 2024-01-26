import { Vector } from 'kontra'
import {
    DOWN2,
    LEFT2,
    RIGHT2,
    UP2,
    getDirection,
    rotateRight,
} from './direction.js'
import { randArray } from '../utils/utils.js'
import { Cell } from './cell.js'
import { CellType } from '../constant.js'

export class Road2 {
    directions: Set<Vector>
    position: Vector

    constructor(position: Vector) {
        this.position = position
        this.directions = new Set()
    }
    addDirection(addedDirections: Vector[]) {
        addedDirections.map((d) => {
            this.directions.add(getDirection(d))
        })
    }

    has(direction: Vector): boolean {
        for (const d of this.directions.values()) {
            if (d == direction) {
                return true
            }
        }
        return false
    }

    get canRotate() {
        return this.directions.size > 0 && this.directions.size < 4
    }

    rotate() {
        const rotatedDir = [...this.directions]
        this.directions.clear()
        this.addDirection(rotatedDir.map((d) => rotateRight(d)))
    }
}

const mapSpriteRoad = {
    12: [DOWN2, RIGHT2],
    13: [DOWN2, LEFT2],
    14: [LEFT2],
    15: [UP2],
    28: [UP2, RIGHT2],
    29: [UP2, LEFT2],
    30: [DOWN2],
    31: [RIGHT2],
    44: [UP2, DOWN2], // Vertical
    45: [LEFT2, RIGHT2], // Horizontal
    46: [LEFT2, UP2, RIGHT2],
    47: [LEFT2, UP2, DOWN2],
    61: [UP2, DOWN2, LEFT2, RIGHT2], // Cross
    62: [RIGHT2, UP2, DOWN2],
    63: [LEFT2, DOWN2, RIGHT2],
} as { [key: number]: Vector[] }

const spriteRoadKey = Object.keys(mapSpriteRoad) as unknown as number[]

export const randomRoad = (): Vector[] => {
    return mapSpriteRoad[randArray(spriteRoadKey)]
}

export const frameFromCell = (cell: Cell): number => {
    if (cell.type == CellType.START) {
        return 9
    }
    if (cell.type == CellType.END) {
        return 26
    }
    if (cell.road) {
        return frameFromDirection(cell.road.directions)
    }
    return 0
}
export const frameFromDirection = (directions: Set<Vector>): number => {
    const possibles = Object.entries(mapSpriteRoad)
        .filter(([, direction]) => {
            return (
                direction.length === directions.size &&
                [...directions].every((d) => direction.includes(d))
            )
        })
        .map(([key]) => Number.parseInt(key))
    if (possibles.length > 0) {
        return randArray(possibles)
    }
    return 0
}

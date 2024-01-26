import { Sprite, SpriteSheet, Vector, emit, randInt } from 'kontra'
import { Cell } from './cell.js'
import {
    Biotope2,
    TBiotope2,
    TCellType,
    TILE_GRASS,
    TILE_SIZE,
    TILE_SAND,
    TILE_WATER,
} from '../constant.js'
import { Road2, frameFromCell } from './road.js'
import { CustomSprite } from '../scene/CustomSprite.js'

export class Grid {
    spritesheet: SpriteSheet
    col: number
    row: number
    cells: Cell[]

    constructor(col: number, row: number, spritesheet: SpriteSheet) {
        this.col = col
        this.row = row
        this.spritesheet = spritesheet
        this.cells = this.init()
    }

    init() {
        const data = new Array(this.col * this.row)
        for (let y = 0; y < this.row; y++) {
            for (let x = 0; x < this.col; x++) {
                data[x + y * this.row] = new Cell(x, y)
            }
        }
        return data
    }

    reset() {
        this.cells.forEach((c) => c.reset())
    }

    getCell(x: number, y: number): Cell {
        return this.cells[x + y * this.col]
    }

    getCellAround(cell: Pick<Vector, 'x' | 'y'>): (Cell | undefined)[] {
        const x = cell.x
        const y = cell.y
        return [
            x == 0 ? undefined : this.cells[x - 1 + (y - 1) * this.col],
            this.cells[x + 0 + (y - 1) * this.col],
            x == this.col - 1
                ? undefined
                : this.cells[x + 1 + (y - 1) * this.col],

            x == 0 ? undefined : this.cells[x - 1 + y * this.col],
            this.cells[x + 0 + y * this.col],
            x == this.col - 1 ? undefined : this.cells[x + 1 + y * this.col],

            x == 0 ? undefined : this.cells[x - 1 + (y + 1) * this.col],
            this.cells[x + 0 + (y + 1) * this.col],
            x == this.col - 1
                ? undefined
                : this.cells[x + 1 + (y + 1) * this.col],
        ]
    }

    setBiotope(x: number, y: number, biotope: TBiotope2) {
        this.cells[x + y * this.col].biotope = biotope
    }

    addDirection(x: number, y: number, ...directions: Vector[]) {
        const road =
            this.cells[x + y * this.col].road ?? new Road2(Vector(x, y))
        road.addDirection(directions)
        this.cells[x + y * this.col].road = road
    }

    setCellType(x: number, y: number, type: TCellType) {
        this.cells[x + y * this.col].type = type
    }

    getBiotopeLayer(): number[] {
        return this.cells.map((c) => {
            switch (c.biotope) {
                case Biotope2.GRASS:
                    return TILE_GRASS
                case Biotope2.WATER:
                    return TILE_WATER
                case Biotope2.WATER_RAMP:
                    return TILE_SAND
                case Biotope2.LAKE:
                    return TILE_WATER
            }
            return TILE_GRASS
        })
    }

    getGroundLayer(): number[] {
        return this.cells.map((c) => c.ground)
    }

    getHerbLayer(): number[] {
        return this.cells.map((c) => c.herb)
    }

    getDecorLayer(): number[] {
        return this.cells.map((c) => c.decor)
    }

    generateSprite(): Sprite[] {
        return this.cells
            .filter((c) => c.road)
            .map((cell) => {
                const sprite = new CustomSprite({
                    spritesheet: this.spritesheet,
                    x: cell.x * TILE_SIZE,
                    y: cell.y * TILE_SIZE,
                    frame: frameFromCell(cell),
                    onDown: function () {
                        emit('cell.ondown', cell)
                    },
                })
                cell.sprite = sprite
                return sprite
            })
    }

    randomRotate() {
        this.cells.forEach((c) => {
            if (c.canRotate && randInt(0, 100) > 60) {
                c.rotate()
                if (randInt(0, 100) > 30) {
                    c.rotate()
                }
                if (randInt(0, 100) > 30) {
                    c.rotate()
                }
            }
        })
    }
}

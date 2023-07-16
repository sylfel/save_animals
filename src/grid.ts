import { randInt } from 'kontra'
import { Direction, oppositeDirection } from './direction'
import { Road, UNKNOWN, getRandomRoad, getRoadFromDirection } from './road'

class Cell {
    row: number
    col: number
    directions: Direction[]
    road: Road
    canRotate: boolean

    constructor(row: number, col: number) {
        this.row = row
        this.col = col
        this.directions = []
        this.road = UNKNOWN
        this.canRotate = false
    }

    addDirection(...directions: Direction[]) {
        this.directions.push(...directions)
    }

    setRoad(road: Road, canRotate: boolean) {
        this.road = road
        this.canRotate = canRotate
    }

    clone() {
        return new Cell(this.row, this.col)
    }

    position() {
        return { row: this.row, col: this.col }
    }
}

export class Grid {
    width: number
    height: number
    cells: Cell[]
    start: Cell
    end: Cell

    constructor(width: number, height: number) {
        const ZONE_SIZE = 0 | ((width * height) / 100)
        this.width = width
        this.height = height
        this.cells = []
        this.init()
        this.start = new Cell(randInt(2, ZONE_SIZE), randInt(2, ZONE_SIZE))
        this.end = new Cell(
            randInt(this.height - ZONE_SIZE, this.height - 1),
            randInt(this.width - ZONE_SIZE, this.width - 1)
        )
        this.generatePath(this.start, this.end)
        this.fill()
        this.randomize()
    }

    private init() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                this.cells.push(new Cell(row, col))
            }
        }
    }

    private generatePath(start: Cell, end: Cell) {
        const path = [start]
        let curr = start
        do {
            const next = curr.clone()
            // recherche des directions possibles
            const directions = [] as Direction[]
            if (curr.col < end.col) {
                directions.push(Direction.RIGHT)
                directions.push(Direction.RIGHT)
            }
            if (curr.col > end.col) {
                directions.push(Direction.LEFT)
            }
            if (curr.row < end.row) {
                directions.push(Direction.DOWN)
            }
            if (curr.row > end.row) {
                directions.push(Direction.UP)
            }
            // Choix d'une directions parmi les possibles
            const direction = directions[randInt(0, directions.length - 1)]
            switch (direction) {
                case Direction.DOWN:
                    next.row = next.row + 1
                    break
                case Direction.UP:
                    next.row = next.row - 1
                    break
                case Direction.RIGHT:
                    next.col = next.col + 1
                    break
                case Direction.LEFT:
                    next.col = next.col - 1
                    break
            }
            // affectation de la direction à la node courante,
            // et son opposé à la suivante
            curr.addDirection(direction)
            next.addDirection(oppositeDirection(direction))
            path.push(next)
            curr = next
        } while (curr.col != end.col || curr.row != end.row)

        path.map((c, i, all) => {
            const isStartorEnd = i == 0 || i == all.length - 1
            c.setRoad(
                getRoadFromDirection(c.directions, isStartorEnd),
                !isStartorEnd
            )
            this.cells[c.row * this.width + c.col] = c
        })
    }

    private randomize() {
        this.cells.map((c) => {
            if (c.canRotate) {
                if (Math.random() > 0.6) {
                    c.road = c.road.rotateLeft()
                } else if (Math.random() < 0.4) {
                    c.road = c.road.rotateRight()
                }
            }
        })
    }

    public getRoadData() {
        const roadData = this.cells.map((c) => c.road.sprite)
        return roadData
    }

    private fill() {
        this.cells.map((c) => {
            if (c.road == UNKNOWN) {
                c.road = getRandomRoad()
            }
        })
    }
}

import { SpriteClass, emit } from 'kontra'
import { TILE_SIZE } from '../constant.js'
import {
    DOWN2,
    LEFT2,
    RIGHT2,
    UP2,
    directionToString,
} from '../component/direction.js'
import { Cell } from '../component/cell.js'
import { Grid } from '../component/grid.js'
import { GridView } from '../component/gridview.js'
import { Queue } from '../utils/queue.js'
import { randArray } from '../utils/utils.js'

export class AnimalSprite extends SpriteClass {
    private keyAnimal: string
    private gridX: number
    private gridY: number
    private gridView: GridView
    private grid: Grid
    private moveToNextTile: boolean = false
    private memory: Queue<Cell> = new Queue()

    constructor(properties: any) {
        super({
            anchor: { x: 0.5, y: 0.5 },
            ...properties,
        })
        this.keyAnimal = properties.animal
        this.gridX = properties.cell.x
        this.gridY = properties.cell.y

        this.gridView = properties.gridView
        this.grid = this.gridView.getGrid()
        this.updatePosition()
    }

    private updatePosition() {
        this.x = this.gridToPixel(this.gridX)
        this.y = this.gridToPixel(this.gridY)
    }

    private gridToPixel(v: number): number {
        return v * TILE_SIZE + TILE_SIZE / 2
    }

    update() {
        this.advance()

        if (this.moveToNextTile) {
            const xDiff = (this.x - this.gridToPixel(this.nextGridX)) * this.dx
            const yDiff = (this.y - this.gridToPixel(this.nextGridY)) * this.dy
            if ((this.dx && xDiff >= 0) || (this.dy && yDiff >= 0)) {
                // arrive on next tile !
                this.moveToNextTile = false
                this.gridX = this.nextGridX
                this.gridY = this.nextGridY
                this.updatePosition()
                const cell = this.grid.getCell(this.gridX, this.gridY)
                if (cell) {
                    this.memory.queue(cell)
                    emit('animal.onCell', this, cell)
                }
            }
        } else {
            const currentCell = this.grid.getCell(this.gridX, this.gridY)
            const cells = this.grid.getCellAround(currentCell)
            const availableCells: Cell[] = []
            const road = cells[4]!.road!
            if (road.has(UP2) && cells[1]?.road?.has(DOWN2)) {
                availableCells.push(cells[1])
            }
            if (road.has(LEFT2) && cells[3]?.road?.has(RIGHT2)) {
                availableCells.push(cells[3])
            }
            if (road.has(RIGHT2) && cells[5]?.road?.has(LEFT2)) {
                availableCells.push(cells[5])
            }
            if (road.has(DOWN2) && cells[7]?.road?.has(UP2)) {
                availableCells.push(cells[7])
            }
            if (availableCells.length === 0) {
                return
            }
            const cell = this.selectNextPosition(availableCells) // TODO : priorize direction !
            const direction = currentCell.directionTo(cell)
            const directionString = directionToString(direction)
            this.dx = direction.x
            this.dy = direction.y
            this.nextGridX = this.gridX + direction.x
            this.nextGridY = this.gridY + direction.y
            if (directionString === 'left') {
                this.scaleX = -1
                this.width = -TILE_SIZE
            } else {
                this.scaleX = 1
                this.width = TILE_SIZE
            }
            this.playAnimation(this.keyAnimal + '_walk_' + directionString)
            this.moveToNextTile = true
        }
    }

    selectNextPosition(possibilities: Cell[]): Cell {
        for (let i = 0; i < this.memory.size; i++) {
            if (possibilities.length <= 1) {
                return possibilities[0] ?? null
            }
            const c = this.memory.get(i)
            for (const c2 of possibilities) {
                if (c.equal(c2)) {
                    this.removeFromArray(possibilities, c2)
                    break
                }
            }
        }
        // return random
        return randArray(possibilities)
    }

    removeFromArray<T>(array: Array<T>, item: T) {
        let index = array.indexOf(item)
        if (index != -1) {
            array.splice(index, 1)
            return true
        }
        return false
    }
}

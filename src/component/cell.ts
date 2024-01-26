import { VectorClass } from 'kontra'
import { Biotope2, CellType, TBiotope2, TCellType } from '../constant.js'
import { Road2, frameFromDirection } from './road.js'
import { CustomSprite } from '../scene/CustomSprite.js'
import { getDirection } from './direction.js'

// Replace VectorClass by custom x/y class
export class Cell extends VectorClass {
    biotope: TBiotope2 = Biotope2.GRASS // change type to "biotope"
    ground: number = 0
    herb: number = 0
    decor: number = 0
    road: Road2 | null = null
    sprite: CustomSprite | null = null
    type: TCellType = CellType.NONE

    constructor(x: number, y: number) {
        super(x, y)
        // this.x = x
        // this.y = y
    }

    get canRotate() {
        return this.road?.canRotate
    }

    rotate() {
        if (this.canRotate) {
            this.road!.rotate()
            this.sprite?.setFrame(frameFromDirection(this.road!.directions))
        }
    }

    reset() {
        this.biotope = Biotope2.GRASS
        this.ground = 0
        this.herb = 0
        this.decor = 0
        this.road = null
        this.sprite = null
        this.type = CellType.NONE
    }

    equal(cell: Cell): boolean {
        return cell?.x == this.x && cell?.y == this.y
    }

    directionTo(target: Cell) {
        return getDirection({
            x: target.x - this.x,
            y: target.y - this.y,
        })
    }
}

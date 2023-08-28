import { Animation, Sprite, SpriteSheet, TileEngine } from 'kontra'
import { Direction, oppositeDirection } from './direction'
import { getCol, getRow } from './customTileEngine'
import { Grid } from './grid'

const TILE_SIZE = 16

class SnappedSprite {
    moveToNextTile = false
    moveDirection: Direction = Direction.UP
    MOVEMENT_SPEED: number

    constructor(
        private sprite: Sprite,
        private row: number,
        private col: number
    ) {
        this.MOVEMENT_SPEED = 1
    }

    update() {
        // Move the player to the next block
        if (this.moveToNextTile) {
            switch (this.moveDirection) {
                case Direction.UP:
                    this.sprite.y -= this.MOVEMENT_SPEED
                    break
                case Direction.DOWN:
                    this.sprite.y += this.MOVEMENT_SPEED
                    break
                case Direction.LEFT:
                    this.sprite.x -= this.MOVEMENT_SPEED
                    break
                case Direction.RIGHT:
                    this.sprite.x += this.MOVEMENT_SPEED
                    break
            }
        }
        // Check if the player has now reached the next block
        if (this.sprite.x % TILE_SIZE == 0 && this.sprite.y % TILE_SIZE == 0) {
            this.row = getRow(this.sprite.y, TILE_SIZE)
            this.col = getCol(this.sprite.x, TILE_SIZE)
            this.moveToNextTile = false
        }

        this.sprite.update()
    }
    moveTo(direction: Direction) {
        if (!this.moveToNextTile) {
            this.moveToNextTile = true
            this.moveDirection = direction
            this.sprite.playAnimation('walk_' + direction)
        }
    }

    position() {
        return { row: this.row, col: this.col }
    }
}

const prepareSprite = (animations: { [name: string]: Animation }) => {
    const sprite = Sprite({
        animations,
    })
    return sprite
}

export class Controller {
    sprites: SnappedSprite[] = []
    th: number
    tw: number

    constructor(
        private grid: Grid,
        private tileEngine: TileEngine,
        private spritesheet: SpriteSheet
    ) {
        this.th = this.tileEngine.tileheight
        this.tw = this.tileEngine.tilewidth
    }

    public register(sprite: Sprite, row: number, col: number) {
        this.sprites.push(new SnappedSprite(sprite, row, col))
        sprite.x = row * this.th
        sprite.y = col * this.tw
        this.tileEngine.add(sprite)
    }

    public update() {
        this.sprites.map((s) => {
            // S'il est pas en train de bouger, on lui donne un mouvement aléatoire
            if (!s.moveToNextTile) {
                const cell = this.grid.getCell(s.position())
                let nextDirections = cell.directions.filter((d) => {
                    const nextCell = this.grid.getCellRelative(cell, d)
                    const include = nextCell.directions.includes(
                        oppositeDirection(d)
                    )
                    return include
                })
                if (nextDirections.length > 1) {
                    const oD = oppositeDirection(s.moveDirection)
                    nextDirections = nextDirections.filter((d) => d != oD)
                }
                if (nextDirections.length > 0) {
                    s.moveTo(
                        nextDirections[
                            0 | (Math.random() * nextDirections.length)
                        ]
                    )
                }
            }
            s.update()
        })
    }

    public addSprite(row: number, col: number) {
        const sprite = prepareSprite(this.spritesheet.animations)
        sprite.x = col * this.tw
        sprite.y = row * this.th
        this.tileEngine.add(sprite)
        this.sprites.push(new SnappedSprite(sprite, row, col))
    }
}

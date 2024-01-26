import {
    GameObjectClass,
    Sprite,
    SpriteSheet,
    TileEngine,
    imageAssets,
    on,
} from 'kontra'
import { TILE_COL, TILE_SIZE, TILE_ROW } from '../constant.js'

export class GridView extends GameObjectClass {
    init({ ...props }) {
        // pre-init
        const spriteSheet = SpriteSheet({
            image: imageAssets['assets/MasterSimple'],
            frameWidth: 16,
            frameHeight: 16,
        })
        const tileEngine = this.initTileEngine()
        const grid = props.grid
        super.init({ spriteSheet, tileEngine, grid, ...props })
        this.refreshLayer()
        on('grid.generated', () => {
            this.refreshLayer()
        })
    }

    initTileEngine(): TileEngine {
        const tileEngine = TileEngine({
            // tile size
            tilewidth: TILE_SIZE,
            tileheight: TILE_SIZE,

            // map size in tiles
            width: TILE_COL,
            height: TILE_ROW,

            // tileset object
            tilesets: [
                {
                    firstgid: 1,
                    image: imageAssets['assets/MasterSimple'],
                },
            ],
            // layer object
            layers: [
                {
                    name: 'biotope',
                    data: [],
                },
                {
                    name: 'ground',
                    data: [],
                },
                {
                    name: 'herb',
                    data: [],
                },
                {
                    name: 'decor',
                    data: [],
                },
            ],
        })
        return tileEngine
    }

    refreshLayer(): void {
        this.tileEngine.setLayer('biotope', this.grid.getBiotopeLayer())
        this.tileEngine.setLayer('ground', this.grid.getGroundLayer())
        this.tileEngine.setLayer('herb', this.grid.getHerbLayer())
        this.tileEngine.setLayer('decor', this.grid.getDecorLayer())
        this.tileEngine.remove(this.tileEngine.objects)
    }

    addSprite(...sprites: Sprite[]) {
        this.tileEngine.add(sprites)
    }
    removeSprite(...sprites: Sprite[]) {
        this.tileEngine.remove(sprites)
    }

    getGrid() {
        return this.grid
    }

    getSprites() {
        return this.tileEngine.objects
    }

    render(): void {
        super.render()
        this.tileEngine.render()
    }

    // TODO : passer par un POOL
    update(): void {
        super.update()
        const sprites = this.tileEngine.objects
        sprites.forEach((s: Sprite) => {
            if (s.currentAnimation) {
                s?.update()
            }
        })
    }
}

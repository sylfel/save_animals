import {
    init,
    GameLoop,
    load,
    imageAssets,
    initPointer,
    SpriteSheet,
} from 'kontra'
import CustomTileEngine from './customTileEngine'
import { HOUSE_1, HOUSE_2, UNKNOWN, getRoadFromSprite } from './road'
import { Grid } from './grid'
import { Controller } from './controller'

const { context } = init()
context.imageSmoothingEnabled = false
const TILE_COL = 12
const TILE_ROW = 12

initPointer()

const loadAssets = () =>
    load('assets/MasterSimple.png', 'assets/spritesheet.png')
const prepareTileEngine = (img: HTMLImageElement, grid: Grid) => {
    const tileEngine = CustomTileEngine({
        // tile size
        tilewidth: 16,
        tileheight: 16,

        // map size in tiles
        width: TILE_COL,
        height: TILE_ROW,

        // tileset object
        tilesets: [
            {
                firstgid: 1,
                image: img,
            },
        ],

        // layer object
        layers: [
            {
                name: 'ground',
                data: Array(TILE_COL * TILE_ROW).fill(18), // vert : 18 , bleu : 82
            },
            {
                name: 'road',
                data: grid.getRoadData(),
            },
            {
                name: 'object',
                data: [],
                visible: false,
            },
        ],
    })

    tileEngine.setTileAtLayer('object', grid.start.position(), HOUSE_1.sprite)
    tileEngine.setTileAtLayer('object', grid.end.position(), HOUSE_2.sprite)

    return tileEngine
}
const prepareSpritesheet = (img: HTMLImageElement): SpriteSheet => {
    return SpriteSheet({
        image: img,
        frameWidth: 16,
        frameHeight: 16,
    })
}

const FRAME_RATE = 10

const initGame = async () => {
    await loadAssets()
    const _g = new Grid(TILE_COL, TILE_ROW)
    const tileEngine = prepareTileEngine(imageAssets['assets/MasterSimple'], _g)
    const spriteSheet = prepareSpritesheet(
        imageAssets['assets/spritesheet.png']
    )

    spriteSheet.createAnimations({
        /*m_idle: {
            frames: '340',
        },
        m_walk_right: {
            frames: '340..343',
            frameRate: 60,
        },
        m_walk_down: {
            frames: '356..359',
            frameRate: 60,
        },
        m_walk_up: {
            frames: '372..375',
            frameRate: 60,
        },
        m_walk_left: {
            frames: '340..343',
            frameRate: 60,
        },*/
        idle: {
            frames: '0',
        },
        walk_right: {
            frames: '0..3',
            frameRate: FRAME_RATE,
        },
        walk_down: {
            frames: '16..19',
            frameRate: FRAME_RATE,
        },
        walk_up: {
            frames: '32..35',
            frameRate: FRAME_RATE,
        },
        walk_left: {
            frames: '0..3',
            frameRate: FRAME_RATE,
        },
    })

    const controller = new Controller(tileEngine, spriteSheet)

    tileEngine.onDown(({ row, col, data }) => {
        const road = getRoadFromSprite(data['road'])
        if (_g.isStart(col, row)) {
            controller.addSprite(row, col)
        } else if (road != UNKNOWN && road.canRotate()) {
            tileEngine.setTileAtLayer(
                'road',
                { row, col },
                road.rotateRight().sprite
            )
        }
    })

    let t = 0
    const loop = GameLoop({
        update: function (dt) {
            t += dt
            if (t > 0.2) {
                for (let row = 0; row < TILE_ROW; row++) {
                    for (let col = 0; col < TILE_COL; col++) {
                        /*tileEngine.setTileAtLayer(
                            'ground',
                            { row, col },
                            Math.floor(Math.random() * 3) + 98
                            
                        )*/
                    }
                }
                t = 0
            }
            controller.update()
        },
        render: function () {
            tileEngine.render()
            tileEngine.renderLayer('object')
        },
    })

    loop.start()
}

initGame()

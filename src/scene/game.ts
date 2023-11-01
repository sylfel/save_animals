import { imageAssets, SpriteSheet, Scene, track } from 'kontra'
import CustomTileEngine from '../customTileEngine'
import { UNKNOWN, getRoadFromSprite } from '../road'
import { Controller } from '../controller'
import { Grid } from '../grid'
import {
    FRAME_RATE,
    TILE_COL,
    TILE_HEIGHT,
    TILE_ROW,
    TILE_WIDTH,
} from '../constant'
import { CustomSprite } from './CustomSprite'

const prepareTileEngine = (
    img: HTMLImageElement | HTMLCanvasElement,
    grid: Grid
) => {
    const tileEngine = CustomTileEngine({
        // tile size
        tilewidth: TILE_WIDTH,
        tileheight: TILE_HEIGHT,

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
                visible: true,
            },
        ],
    })
    return tileEngine
}
const prepareSpritesheet = (img: HTMLImageElement): SpriteSheet => {
    return SpriteSheet({
        image: img,
        frameWidth: 16,
        frameHeight: 16,
    })
}

const initGame = () => {
    const _g = new Grid(TILE_COL, TILE_ROW)
    const spriteSheetDecor = prepareSpritesheet(
        imageAssets['assets/MasterSimple']
    )
    const spriteSheet = prepareSpritesheet(
        imageAssets['assets/spritesheet.png']
    )

    const tileEngine = prepareTileEngine(spriteSheetDecor.image, _g)

    const s = new CustomSprite({
        spritesheet: spriteSheetDecor,
        x: _g.start.position().col * TILE_WIDTH,
        y: _g.start.position().row * TILE_HEIGHT,
        frame: 43,
        onDown: function () {
            controller.addSprite(
                _g.start.position().row,
                _g.start.position().col
            )
        },
    })
    track(s)
    tileEngine.add(s)

    const s2 = new CustomSprite({
        spritesheet: spriteSheetDecor,
        gridPos: _g.end.position(),
        frame: 27,
        x: _g.end.position().col * TILE_WIDTH,
        y: _g.end.position().row * TILE_HEIGHT,
    })
    tileEngine.add(s2)

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

    const controller = new Controller(_g, tileEngine, spriteSheet)

    tileEngine.onDown(({ row, col, data }) => {
        const road = getRoadFromSprite(data['road'])
        if (road != UNKNOWN && road.canRotate()) {
            const newRoad = road.rotateRight()
            tileEngine.setTileAtLayer('road', { row, col }, newRoad.sprite)
            _g.setRoad(col, row, newRoad)
        }
    })

    const sceneEngine = Scene({
        id: 'game',
        objects: [tileEngine],
        update: () => {
            controller.update()
        },
        render: function () {
            tileEngine.render()
            tileEngine.renderLayer('object')
        },
    })

    return sceneEngine
}

export { initGame }

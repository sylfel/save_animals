import {
    init,
    GameLoop,
    load,
    imageAssets,
    initPointer,
    SpriteSheet,
    on,
    GameObject,
    Scene,
} from 'kontra'
import CustomTileEngine from './customTileEngine'
import { HOUSE_1, HOUSE_2, UNKNOWN, getRoadFromSprite } from './road'
import { Controller } from './controller'
import { sceneIntro } from './scene/intro'
import { Grid } from './grid'

const { context } = init()
context.imageSmoothingEnabled = false
const TILE_COL = 12
const TILE_ROW = 12

initPointer()

const loadAssets = () => {
    return load('assets/MasterSimple.png', 'assets/spritesheet.png')
}
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
                visible: true,
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

type SimpleGameObject = Pick<GameObject, 'render' | 'update'>

const FRAME_RATE = 12

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

    const controller = new Controller(_g, tileEngine, spriteSheet)

    const sceneEngine = Scene({
        id: 'game',
        objects: [tileEngine],
    })

    tileEngine.onDown(({ row, col, data }) => {
        const road = getRoadFromSprite(data['road'])
        if (_g.isStart(col, row)) {
            controller.addSprite(row, col)
        } else if (road != UNKNOWN && road.canRotate()) {
            const newRoad = road.rotateRight()
            tileEngine.setTileAtLayer('road', { row, col }, newRoad.sprite)
            _g.setRoad(col, row, newRoad)
        }
    })

    let currentScene: SimpleGameObject = sceneIntro('Save', 'The', 'Animals')
    const sceneCallback = (emmiter: string) => {
        if (emmiter === 'intro') {
            currentScene = sceneEngine
        }
    }
    on('scene.finish', sceneCallback)

    const loop = GameLoop({
        update: function (dt) {
            currentScene.update && currentScene.update(dt)
            controller.update()
        },
        render: function () {
            // tileEngine.render()
            // tileEngine.renderLayer('object')
            currentScene.render()
        },
    })

    loop.start()
}

initGame()

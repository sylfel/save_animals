import {
    Scene,
    SpriteSheet,
    imageAssets,
    on,
    onKey,
    randInt,
    track,
    untrack,
} from 'kontra'
import { GridView } from '../component/gridview.js'
import { generateGrid } from '../utils/generator.js'
import { CellType, TILE_COL, TILE_ROW } from '../constant.js'
import { Cell } from '../component/cell.js'
import { Grid } from '../component/grid.js'
import { randArray } from '../utils/utils.js'
import { AnimalSprite } from './animalSprite.js'
import { CustomSprite } from './CustomSprite.js'

// TODO : configurer tous les animaux
const animalConfig = {
    // s1: 0,
    // s2: 4,
    // s3: 8,
    // s4: 12,
    // //
    // s5: 48,
    // s6: 52,
    // s7: 56,
    // s8: 60,
    // //
    // s9: 96,
    // s10: 100,
    // s11: 104,
    // s12: 108,
    // //
    // m1: 148,
    // m2: 156,
    // //
    // m3: 196,
    // m4: 204,
    // //
    // o1: 288,
    // o2: 292,
    // o3: 296,
    // //
    // mouton1:336,
    // mouton2:340,
    //
    w1: 384,
    w2: 388,
    w3: 392,
    w4: 396,
    //
    w5: 432,
    w6: 436,
}

const createGridView = (spriteSheet: SpriteSheet) => {
    const grid = new Grid(TILE_COL, TILE_ROW, spriteSheet)
    const gridView = new GridView({ grid })
    return gridView
}

const fillGrid = (gridView: GridView) => {
    const seed = randInt(0, 100)
    generateGrid(seed, gridView.getGrid())
    let sprites = gridView.getGrid().generateSprite()
    gridView.getGrid().randomRotate()
    track(sprites)
    gridView.addSprite(...sprites)
}

const addAnimal = (
    gridView: GridView,
    cell: Cell,
    spriteAnimals: SpriteSheet
) => {
    const animal = new AnimalSprite({
        animal: randArray(Object.keys(animalConfig)),
        cell,
        animations: spriteAnimals.animations,
        gridView,
    })
    gridView.addSprite(animal)
}

const removeAnimal = (
    gridView: GridView,
    _cell: Cell,
    animal: CustomSprite
) => {
    gridView.removeSprite(animal)
}

const createScene = (gridView: GridView, spriteAnimals: SpriteSheet) => {
    const sceneEngine = Scene({
        id: 'game',
        objects: [gridView],
        onShow: () => {
            onKey('g', () => {
                untrack(gridView.getSprites())
                fillGrid(gridView)
            })

            on('cell.ondown', (cell: Cell) => {
                if (cell.type === CellType.START) {
                    addAnimal(gridView, cell, spriteAnimals)
                } else if (cell.canRotate) {
                    cell.rotate()
                }
            })

            on('animal.onCell', (animal: CustomSprite, cell: Cell) => {
                if (cell.type === CellType.END) {
                    removeAnimal(gridView, cell, animal)
                }
            })
        },
        update: () => {
            gridView.update()
        },
        render: function () {
            gridView.render()
        },
    })

    return sceneEngine
}

const createSripteSheetAnimals = () => {
    //
    const spriteAnimals = SpriteSheet({
        image: imageAssets['assets/spritesheet'],
        frameWidth: 16,
        frameHeight: 16,
    })
    // create animations
    const directions = ['right', 'down', 'up']
    const animations = {} as { [key: string]: {} }
    for (let [key, value] of Object.entries(animalConfig)) {
        directions.forEach((dir, idx) => {
            const animKey = key + '_walk_' + dir
            animations[animKey] = {
                frames:
                    String(value + idx * 16) +
                    '..' +
                    String(value + idx * 16 + 3),
                frameRate: 15,
            }
        })
        animations[key + '_walk_left'] = animations[key + '_walk_right']
    }
    spriteAnimals.createAnimations(animations)
    // return final
    return spriteAnimals
}

const initGame = () => {
    const spriteAnimals = createSripteSheetAnimals()

    const spriteSheet = SpriteSheet({
        image: imageAssets['assets/MasterSimple'],
        frameWidth: 16,
        frameHeight: 16,
    })
    const gridView = createGridView(spriteSheet)
    fillGrid(gridView)

    return createScene(gridView, spriteAnimals)
}

export { initGame }

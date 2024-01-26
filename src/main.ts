import { init, GameLoop, load, initPointer, on, initKeys } from 'kontra'
import { sceneIntro } from './scene/intro.js'
import { initGame } from './scene/game.js'
import { TILE_COL, TILE_SIZE, TILE_ROW } from './constant.js'

const { context } = init()

const loadAssets = () => {
    return load('assets/MasterSimple.png', 'assets/spritesheet.png')
}

const initApp = async () => {
    context.imageSmoothingEnabled = false
    context.canvas.width = TILE_COL * TILE_SIZE
    context.canvas.height = TILE_ROW * TILE_SIZE
    initPointer({
        radius: 1,
    })
    initKeys()
    await loadAssets()

    let currentScene = sceneIntro('Save', 'The', 'Animals')
    const sceneCallback = (emmiter: string) => {
        if (emmiter === 'intro') {
            currentScene = initGame()
            currentScene.show()
        }
    }
    on('scene.finish', sceneCallback)

    const loop = GameLoop({
        update: function (dt) {
            currentScene.update(dt)
        },
        render: function () {
            currentScene.render()
        },
    })

    loop.start()
}

initApp()

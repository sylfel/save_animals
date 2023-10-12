import { init, GameLoop, load, initPointer, on, GameObject } from 'kontra'
import { sceneIntro } from './scene/intro'
import { initGame } from './scene/game'

const { context } = init()
context.imageSmoothingEnabled = false

initPointer()

const loadAssets = () => {
    return load('assets/MasterSimple.png', 'assets/spritesheet.png')
}

type SimpleGameObject = Pick<GameObject, 'render' | 'update'>

const initApp = async () => {
    await loadAssets()

    let currentScene: SimpleGameObject = sceneIntro('Save', 'The', 'Animals')
    const sceneCallback = (emmiter: string) => {
        if (emmiter === 'intro') {
            currentScene = initGame()
        }
    }
    on('scene.finish', sceneCallback)

    const loop = GameLoop({
        update: function (dt) {
            currentScene.update && currentScene.update(dt)
        },
        render: function () {
            currentScene.render()
        },
    })

    loop.start()
}

initApp()

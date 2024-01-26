import { Scene, Text, emit } from 'kontra'
import { easeInOutSine } from '../utils/utils.js'

const TEXT_SPEED = 0.1

const sceneIntro = (...allText: string[]) => {
    let phase = 0
    let t = 0
    const nextText = allText
    let text = nextText.shift()

    const textOptions = {
        color: 'white',
        font: '45px Arial, sans-serif',
        opacity: 0,
        textAlign: 'center',
        x: 96,
        y: 96,
        anchor: { x: 0.5, y: 0.5 },
    }

    const processNextText = () => {
        phase = 0
        t = 0
        text = nextText.shift()
        if (text) {
            introText.text = text
        } else {
            emit('scene.finish', 'intro')
        }
    }

    const introText = Text({
        text: text || '',
        ...textOptions,
        update(dt) {
            t += dt ?? 0
            if (phase != 2) {
                let opa = easeInOutSine(t, 0, 1, TEXT_SPEED)
                if (opa >= 0.95) {
                    phase = 1
                    opa = 1
                }
                if (phase == 1 && opa < 0.01) {
                    phase = 2
                    opa = 0
                    processNextText()
                }
                introText.opacity = opa
            }
        },
    })

    return Scene({
        id: 'intro',
        objects: [introText],
    })
}

export { sceneIntro }

import { SpriteClass, SpriteSheet } from 'kontra'

export class CustomSprite extends SpriteClass {
    init({
        spritesheet,
        frame,
        ...props
    }: {
        spritesheet: SpriteSheet
        frame: number
    }): void {
        const width = spritesheet.frame.width | 0
        const height = spritesheet.frame.height | 0
        super.init({ width, height, spritesheet, ...props })
        this.setFrame(frame)
    }

    setFrame(frame: number) {
        this.frame = frame
        const row = (frame / this.spritesheet._f) | 0
        const col = frame % this.spritesheet._f | 0
        this.ssx = col * this.width
        this.ssy = row * this.height
    }

    draw() {
        const { spritesheet, context, ssx, ssy, width, height } = this
        context.drawImage(
            spritesheet.image,
            ssx,
            ssy,
            width,
            height,
            0,
            0,
            width,
            height
        )
    }
}

import { Sprite, TileEngineClass, getPointer, track } from 'kontra'

type TileEngineProperties = {
    width: number
    height: number
    tilewidth: number
    tileheight: number
    context?: CanvasRenderingContext2D
    tilesets: object[]
    layers: object[]
}

export function getRow(y: number, tileheight: number) {
    return (y / tileheight) | 0
}

export function getCol(x: number, tilewidth: number) {
    return (x / tilewidth) | 0
}

type Data = { [key: string]: number }

type cellDataClick = {
    row: number
    col: number
    data: Data
}

type onDownFunction = (data: cellDataClick) => void

class CustomTileEngine extends TileEngineClass {
    private onDownCallback: onDownFunction | null = null

    constructor(properties: TileEngineProperties) {
        super(properties)
        this.initFakeSprite()
    }

    private initFakeSprite(): void {
        const { scaleX, scaleY } = this.getScaleContext(this.context)
        const _fakeSprite = Sprite({
            x: 0,
            y: 0,
            width: this.mapwidth * scaleX,
            height: this.mapheight * scaleY,
            onDown: () => this.onFakeDown(),
        })
        this.add(_fakeSprite)
        track(_fakeSprite)
    }

    private getScaleContext(context: CanvasRenderingContext2D): {
        scaleX: number
        scaleY: number
    } {
        const { a: scaleX, d: scaleY } = context.getTransform()
        return { scaleX, scaleY }
    }

    private onFakeDown(): void {
        const { x, y } = getPointer()
        const row = getRow(y, this.tileheight)
        const col = getCol(x, this.tilewidth)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = Object.keys((<any>this).layerMap).reduce((acc, name) => {
            acc[name] = this.tileAtLayer(name, { row, col })
            return acc
        }, {} as Data)

        this.onDownCallback &&
            this.onDownCallback({
                row,
                col,
                data,
            })
    }

    onDown(callback: onDownFunction) {
        this.onDownCallback = callback
    }
}

export default function factory(properties: TileEngineProperties) {
    return new CustomTileEngine(properties)
}

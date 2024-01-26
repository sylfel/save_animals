import { Vector, randInt } from 'kontra'
import { TILE_COL } from '../constant.js'

/**
 *
 * @param t current time
 * @param b begin value
 * @param _c final value
 * @param d total duration
 * @returns current value
 */
export function easeInOutSine(t: number, b: number, _c: number, d: number) {
    const c = _c - b
    return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b
}

export function average(data: number[]): number {
    const valid = data.filter(Boolean)
    return (valid.reduce((acc, v) => acc + v, 0) / valid.length) & 255
}

export function smooth(data: number[], iteration: number): number[] {
    let result = data
    for (let it = 0; it < iteration; it++) {
        result = result.map((v, idx, _a) => {
            const values = [
                _a[idx - TILE_COL - 1],
                _a[idx - TILE_COL],
                _a[idx - TILE_COL + 1],
                _a[idx - 1],
                v,
                _a[idx + 1],
                _a[idx + TILE_COL - 1],
                _a[idx + TILE_COL],
                _a[idx + TILE_COL + 1],
            ]
            return average(values)
        })
    }
    return result
}

export function rnd(x: number, y: number, seed: number) {
    return (
        (Math.sin(x * 0.153 * seed) * Math.tan(y * 93.25 * seed) * 8745) & 255
    )
}

export function randArray<T>(array: Array<T>): T {
    return array[randInt(0, array.length - 1)]
}

export function toIndex(vec: Vector): number {
    return vec.x + vec.y * TILE_COL
}

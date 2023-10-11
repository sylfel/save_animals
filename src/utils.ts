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

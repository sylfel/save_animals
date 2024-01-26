import { Vector, emit, randInt } from 'kontra'
import {
    Biotope2,
    CellType,
    NB_ZONE,
    SMOOTH,
    TBiotope2,
    THRESHOLD,
    ZONE_SIZE,
} from '../constant.js'
import { randArray, rnd, smooth, toIndex } from './utils.js'
import { DOWN2, LEFT2, RIGHT2, UP2 } from '../component/direction.js'
import { randomRoad } from '../component/road.js'
import { Grid } from '../component/grid.js'

// Generate a all-inclusive grid
export function generateGrid(seed: number, grid: Grid) {
    // generate base grids
    grid.reset()

    // generate path
    const { zoneStart, zoneEnd, zoneWaypoint } = selectZone()

    const start = generatePoint(zoneStart)
    const end = generatePoint(zoneEnd)
    const waypoint = generatePoint(zoneWaypoint)

    const path = generatePath(start, waypoint)
    path.pop()
    path.push(...generatePath(waypoint, end))

    // generate biotopoe
    generateBiotope(grid, seed, path)

    // generate ground tiling
    generateGround(grid)

    // add some herb / flower
    generateHerb(grid)

    generateSpritePath(grid, path)

    generateDecor(grid)

    emit('grid.generated', grid)
}

function generateBiotope(grid: Grid, seed: number, path: Vector[]) {
    // generate empty random array
    const data = new Array(grid.row * grid.col)
    for (let x = 0; x < grid.col; x++) {
        for (let y = 0; y < grid.row; y++) {
            data[x + y * grid.col] = rnd(x, y, seed)
        }
    }
    // smooth array
    const smoothed = smooth(data, SMOOTH)

    // treshold, to have only simple biotope
    const tresholdMap = smoothed.map((v) =>
        v > THRESHOLD ? Biotope2.GRASS : Biotope2.WATER
    ) as TBiotope2[]

    // transform path cell to grass biotope
    path.map((v) => {
        tresholdMap[toIndex(v)] = Biotope2.GRASS
    })

    // tranform down transition from grass to water to WATER_RAMP
    // and water arounded by something else to LAKE
    for (let x = 0; x < grid.col; x++) {
        for (let y = 0; y < grid.row; y++) {
            const idx = x + y * grid.col
            let biotope = tresholdMap[idx]
            const bu = y == 0 ? Biotope2.GRASS : tresholdMap[idx - grid.col]
            const bd = tresholdMap[idx + grid.col] ?? Biotope2.GRASS
            const br = x == grid.col - 1 ? biotope : tresholdMap[idx + 1]
            const bl = x == 0 ? biotope : tresholdMap[idx - 1]
            if (biotope == Biotope2.WATER && bu != Biotope2.WATER) {
                biotope = Biotope2.WATER_RAMP
                if (
                    bd != Biotope2.WATER &&
                    bl != Biotope2.WATER &&
                    br != Biotope2.WATER
                ) {
                    biotope = Biotope2.LAKE
                }
            }
            grid.setBiotope(x, y, biotope)
        }
    }
}

function generateGround(grid: Grid) {
    return grid.cells.forEach((c) => {
        const cells = grid.getCellAround(c)
        const tl = cells[0]?.biotope ?? Biotope2.LAKE
        const t = cells[1]?.biotope ?? Biotope2.LAKE
        const tr = cells[2]?.biotope ?? Biotope2.LAKE
        const l = cells[3]?.biotope ?? Biotope2.LAKE
        const r = cells[5]?.biotope ?? Biotope2.LAKE

        const gtl = tl & Biotope2.GRASS
        const gt = t & Biotope2.GRASS
        const gtr = tr & Biotope2.GRASS
        const gl = l & Biotope2.GRASS
        const gr = r & Biotope2.GRASS

        switch (c.biotope) {
            case Biotope2.LAKE:
                c.ground = 71
                break
            case Biotope2.GRASS:
                if (!gt) {
                    if (!gl && !gr) {
                        c.ground = 6
                    } else {
                        c.ground = gl ? (gr ? 2 : 3) : 1
                    }
                } else {
                    if (!gl || !gr) {
                        if (gr) {
                            c.ground = gtl ? 37 : 17
                        } else if (gl) {
                            c.ground = gtr ? 36 : 19
                        } else {
                            c.ground = gtl && gtr ? 20 : gtl ? 5 : gtr ? 4 : 22
                        }
                    }
                }
                break
            case Biotope2.WATER_RAMP:
                if (l === Biotope2.WATER && r === Biotope2.WATER) {
                    c.ground = 54
                } else if (l === Biotope2.WATER) {
                    c.ground = 65
                } else if (r === Biotope2.WATER) {
                    c.ground = 67
                } else {
                    c.ground =
                        tl === Biotope2.WATER
                            ? 65
                            : tr === Biotope2.WATER
                              ? 67
                              : 66
                }
                break
            case Biotope2.WATER:
                c.ground = 0
                break
        }
    })
}

function generateHerb(grid: Grid) {
    grid.cells.forEach((c) => {
        if (c.biotope === Biotope2.GRASS) {
            c.herb = randArray([8, 8, 8, 8, 8, 9])
        }
    })
}

function generateSpritePath(grid: Grid, path: Vector[]) {
    let lastCell = null
    for (let i = 0; i < path.length; i++) {
        const cell = path[i]
        if (!lastCell) {
            // start cell
            grid.addDirection(cell.x, cell.y, UP2, LEFT2, RIGHT2, DOWN2)
            grid.setCellType(cell.x, cell.y, CellType.START)
        } else {
            const move = cell.subtract(lastCell)
            grid.addDirection(lastCell.x, lastCell.y, move)
            if (i === path.length - 1) {
                // end cell
                grid.addDirection(cell.x, cell.y, UP2, LEFT2, RIGHT2, DOWN2)
                grid.setCellType(cell.x, cell.y, CellType.END)
            } else {
                grid.addDirection(cell.x, cell.y, move.scale(-1))
            }
        }
        lastCell = cell
    }

    // add random direction
    const directions = [UP2, LEFT2, DOWN2, RIGHT2]
    for (let i = 0; i < path.length; i++) {
        const cell = path[i]
        if (randInt(1, 100) > 50) {
            grid.addDirection(cell.x, cell.y, randArray(directions))
        }
        if (randInt(1, 100) > 60) {
            grid.addDirection(cell.x, cell.y, randArray(directions))
        }
        if (randInt(1, 100) > 70) {
            grid.addDirection(cell.x, cell.y, randArray(directions))
        }
    }
}

function generateDecor(grid: Grid) {
    grid.cells.forEach((cell) => {
        if (cell.road) {
            return
        }
        if (cell.biotope == Biotope2.WATER) {
            if (randInt(0, 100) > 95) {
                cell.decor = randArray([72, 72, 74, 90])
            }
            return
        }
        if (cell.biotope == Biotope2.GRASS) {
            if (randInt(0, 100) > 50) {
                grid.addDirection(cell.x, cell.y, ...randomRoad())
            } else if (randInt(0, 99) > 50) {
                cell.decor = randArray([
                    24, 24, 24, 24, 40, 40, 40, 40, 24, 26, 40, 55, 56, 57, 58,
                ])
            }
        }
    })
}

function generateZone(): Vector {
    return Vector({
        x: randInt(0, NB_ZONE - 1),
        y: randInt(0, NB_ZONE - 1),
    })
}

function generatePoint(zone: Vector): Vector {
    const point = Vector({
        x: randInt(0, ZONE_SIZE - 1),
        y: randInt(0, ZONE_SIZE - 1),
    })
    return point.add(zone.scale(ZONE_SIZE))
}

// todo : use seed to select zone
function selectZone() {
    // select a zone to start
    const zoneStart = generateZone()
    // select a zone to end
    let zoneEnd = generateZone()
    while (zoneStart.distance(zoneEnd) < 2) {
        zoneEnd = generateZone()
    }
    // select a zone to waypoint
    let zoneWaypoint = generateZone()
    while (
        zoneStart.distance(zoneWaypoint) < 2 ||
        zoneEnd.distance(zoneWaypoint) < 2
    ) {
        zoneWaypoint = generateZone()
    }
    // return 3 zones
    return {
        zoneStart,
        zoneEnd,
        zoneWaypoint,
    }
}

/**
 * Generate path between two point
 */
function generatePath(from: Vector, to: Vector) {
    let cell = from
    const paths = [from]
    while (cell.distance(to) != 0) {
        const nextCells = [] as Vector[]
        if (to.x !== cell.x) {
            nextCells.push(to.x > cell.x ? RIGHT2 : LEFT2)
        }
        if (to.y !== cell.y) {
            nextCells.push(to.y > cell.y ? DOWN2 : UP2)
        }
        cell = cell.add(randArray(nextCells))
        paths.push(cell)
    }
    return paths
}

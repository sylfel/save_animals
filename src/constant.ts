export const FRAME_RATE = 12

export const TILE_SIZE = 16

export const THRESHOLD = 120
export const SMOOTH = 4

export const TILE_GRASS = 18
export const TILE_WATER = 82
export const TILE_SAND = 130

export const Biotope2 = {
    GRASS: 1 << 0,
    WATER: 1 << 1,
    WATER_RAMP: 1 << 2,
    LAKE: 0b111,
} as const
export type TBiotope2 = (typeof Biotope2)[keyof typeof Biotope2]

export const CellType = {
    NONE: 0,
    START: 1,
    END: 2,
} as const
export type TCellType = (typeof CellType)[keyof typeof CellType]

export const NB_ZONE = 4
export const ZONE_SIZE = 3

export const TILE_COL = NB_ZONE * ZONE_SIZE
export const TILE_ROW = NB_ZONE * ZONE_SIZE

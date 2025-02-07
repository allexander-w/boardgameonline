import HEAP_DEFAULTS from "../defaults/heap.defaults.js";

export default [
    {
        id: "fire",
        heap_config: { x: 1100, y: -450, width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: 1100 + (HEAP_DEFAULTS.WIDTH/2), y: -450 + HEAP_DEFAULTS.HEIGHT/2, },
        count: 33,
        same: true,
        src: "/entities/fire/fire_sprite.png"
    },

    {
        id: "doors",
        heap_config: { x: 1100, y: -450 + HEAP_DEFAULTS.HEIGHT + 40, width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: 1100 + (HEAP_DEFAULTS.WIDTH/2), y: -450 + (HEAP_DEFAULTS.WIDTH - 40) + (HEAP_DEFAULTS.HEIGHT/2), },
        count: 8,
        same: true,
        src: "/entities/doors/door.png"
    },

    {
        id: "burn",
        heap_config: { x: 1100, y: -450 + (HEAP_DEFAULTS.HEIGHT * 2) + (40 * 2), width: 100, height: 100 },
        element: { x: 1100 + (100/2), y: -450 + ((HEAP_DEFAULTS.HEIGHT * 2) + 80) + 50, width: 57, height: 57 },
        count: 24,
        same: true,
        duo: true,
        src: "/entities/burnout/burn.png"
    },

    {
        id: "run",
        heap_config: { x: 1100 + 80 + 100, y: -450 + (HEAP_DEFAULTS.HEIGHT * 2) + (40 * 2), width: 100, height: 100 },
        element: { x: 1100 + 80 + 100 + (100/2), y: -450 + ((HEAP_DEFAULTS.HEIGHT * 2) + 80) + 50, width: 57, height: 57 },
        count: 21,
        same: true,
        duo: true,
        src: "/entities/run/run.png"
    },

    {
        id: "warn",
        heap_config: { x: 1100, y: -450 + (HEAP_DEFAULTS.HEIGHT * 2 + 100) + (40 * 3), width: 100, height: 100 },
        element: { x: 1100 + (100/2), y: -450 + ((HEAP_DEFAULTS.HEIGHT * 2 + 100) + (40*3)) + 50, width: 75, height: 75 },
        count: 6,
        same: true,
        duo: true,
        src: "/entities/warn/warn.png"
    },

    {
        id: "medicine",
        heap_config: { x: 1100 + 80 + 100, y: -450 + (HEAP_DEFAULTS.HEIGHT * 2 + 100) + (40 * 3), width: 100, height: 100 },
        element: { x: 1100 + 80 + 100 + (100/2), y: -450 + ((HEAP_DEFAULTS.HEIGHT * 2 + 100) + (40*3)) + 50, width: 90, height: 90 },
        count: 3,
        same: true,
        duo: true,
        src: "/entities/medicine/medicine.png"
    },

    {
        id: "person",
        heap_config: { x: 1100, y: -450 + (HEAP_DEFAULTS.HEIGHT * 2 + (100 * 2)) + (40 * 4), width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: 1100 + (HEAP_DEFAULTS.WIDTH/2), y: -450 + ((HEAP_DEFAULTS.HEIGHT * 2 + 200) + (40*4)) + (HEAP_DEFAULTS.HEIGHT/2), width: 95, height: 95 },
        count: 18,
        flipped: false,
        same: false,
        duo: true,
        src: "/entities/persons/"
    },

    {
        id: "machine",
        heap_config: { x: 1100, y: -450 + (HEAP_DEFAULTS.HEIGHT * 3 + (100 * 2)) + (40 * 5), width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: 1100 + (HEAP_DEFAULTS.WIDTH/2), y: -450 + ((HEAP_DEFAULTS.HEIGHT * 3 + 200) + (40*5)) + (HEAP_DEFAULTS.HEIGHT/2), width: 253, height: 151 },
        count: 2,
        flipped: false,
        same: false,
        duo: false,
        src: "/entities/machines/"
    },

    {
        id: "hero_chip",
        heap_config: { x: 1100, y: -450 + (HEAP_DEFAULTS.HEIGHT * 4 + (100 * 2)) + (40 * 6), width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: 1100 + (HEAP_DEFAULTS.WIDTH/2), y: -450 + ((HEAP_DEFAULTS.HEIGHT * 4 + 200) + (40*6)) + (HEAP_DEFAULTS.HEIGHT/2), width: 90, height: 90 },
        count: 4,
        flipped: false,
        same: false,
        duo: false,
        src: "/entities/hero_chip/"
    },

    {
        id: "hero",
        heap_config: { x: 1100 + 40 + HEAP_DEFAULTS.WIDTH, y: -450, width: 360, height: 500 },
        element: { x: 1100 +  40 + HEAP_DEFAULTS.WIDTH + (360/2), y: -450 + (500/2), width: 303, height: 452, cornerRadius: 15 },
        count: 8,
        flipped: false,
        same: false,
        duo: true,
        src: "/entities/hero/"
    },

    {
        id: "color",
        heap_config: { x: 1100 + 40 + HEAP_DEFAULTS.WIDTH, y: -450 + 40 + 500, width: 360, height: 300 },
        element: { x: 1100 +  40 + HEAP_DEFAULTS.WIDTH + (360/2), y: -450 + 40 + 500 + (300/2), width: 303, height: 221, cornerRadius: 15 },
        count: 4,
        flipped: false,
        same: false,
        duo: false,
        src: "/entities/color/"
    },

    {
        id: "fault",
        heap_config: { x: 1100 + 40 + HEAP_DEFAULTS.WIDTH, y: -450 + (40 * 2) + 500 + 300, width: 100, height: 100 },
        element: { x: 1100 +  40 + HEAP_DEFAULTS.WIDTH + (100/2), y: -450 + (40 * 2) + 500 + 300 + (100/2), width: 40, height: 40, cornerRadius: 0 },
        count: 24,
        flipped: false,
        same: true,
        duo: false,
        src: "/entities/fault/fault.png"
    },
]

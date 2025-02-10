import HEAP_DEFAULTS from "../../defaults/heap.defaults";

export default [
    {
        id: "vine",
        heap_config: { x: 145, y: 150, width: 260, height: 420 },
        element: { x: 145 + (260/2), y: 150 + 420/2, width: 245, height: 401, cornerRadius: 10 },
        count: 42,
        flipped: true,
        same: false,
        duo: true,
        src: "/vine/vine/"
    },

    {
        id: "summer",
        heap_config: { x: 855, y: 150, width: 260, height: 420 },
        element: { x: 855 + (260/2), y: 150 + 420/2, width: 245, height: 401, cornerRadius: 10 },
        count: 38,
        flipped: true,
        same: false,
        duo: true,
        src: "/vine/summer/"
    },

    {
        id: "sponsore",
        heap_config: { x: 855 + 700, y: 150, width: 260, height: 420 },
        element: { x: 855 + 700 + (260/2), y: 150 + 420/2, width: 245, height: 401, cornerRadius: 10 },
        count: 36,
        flipped: true,
        same: false,
        duo: true,
        src: "/vine/sponsore/"
    },

    {
        id: "winter",
        heap_config: { x: 855 + 700 + 710, y: 150, width: 260, height: 420 },
        element: { x: 855 + 700 + 710 + (260/2), y: 150 + 420/2, width: 245, height: 401, cornerRadius: 10 },
        count: 31,
        flipped: true,
        same: false,
        duo: true,
        src: "/vine/winter/"
    },


    {
        id: "moneyOne",
        heap_config: { x: 0, y: -HEAP_DEFAULTS.HEIGHT - 40, width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: 0 + (HEAP_DEFAULTS.WIDTH/2), y: -HEAP_DEFAULTS.HEIGHT - 40 + HEAP_DEFAULTS.HEIGHT/2, width: 60, height: 60 },
        count: 10,
        same: true,
        duo: false,
        src: "/vine/money/1.png"
    },

    {
        id: "moneyTwo",
        heap_config: { x: HEAP_DEFAULTS.WIDTH + 60, y: -HEAP_DEFAULTS.HEIGHT - 40, width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: HEAP_DEFAULTS.WIDTH + 60 + (HEAP_DEFAULTS.WIDTH/2), y: -HEAP_DEFAULTS.HEIGHT - 40 + HEAP_DEFAULTS.HEIGHT/2, width: 80, height: 80 },
        count: 10,
        same: true,
        duo: false,
        src: "/vine/money/2.png"
    },

    {
        id: "moneyThree",
        heap_config: { x: (HEAP_DEFAULTS.WIDTH + 60) * 2, y: -HEAP_DEFAULTS.HEIGHT - 40, width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: ((HEAP_DEFAULTS.WIDTH + 60) * 2) + (HEAP_DEFAULTS.WIDTH/2), y: -HEAP_DEFAULTS.HEIGHT - 40 + HEAP_DEFAULTS.HEIGHT/2, width: 100, height: 100 },
        count: 10,
        same: true,
        duo: false,
        src: "/vine/money/3.png"
    },

    {
        id: "chip",
        heap_config: { x: (HEAP_DEFAULTS.WIDTH + 60) * 3, y: -HEAP_DEFAULTS.HEIGHT - 40, width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: ((HEAP_DEFAULTS.WIDTH + 60) * 3) + (HEAP_DEFAULTS.WIDTH/2), y: -HEAP_DEFAULTS.HEIGHT - 40 + HEAP_DEFAULTS.HEIGHT/2, width: 75, height: 75, cornerRadius: 15 },
        count: 34,
        same: false,
        duo: false,
        src: "/vine/chip/"
    },

    {
        id: "chipVine",
        heap_config: { x: (HEAP_DEFAULTS.WIDTH + 60) * 4, y: -HEAP_DEFAULTS.HEIGHT - 40, width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: ((HEAP_DEFAULTS.WIDTH + 60) * 4) + (HEAP_DEFAULTS.WIDTH/2), y: -HEAP_DEFAULTS.HEIGHT - 40 + HEAP_DEFAULTS.HEIGHT/2, width: 75, height: 75, cornerRadius: 15 },
        count: 1,
        same: true,
        duo: false,
        src: "/vine/chip/103.png"
    },

    {
        id: "chipSeason",
        heap_config: { x: (HEAP_DEFAULTS.WIDTH + 60) * 5, y: -HEAP_DEFAULTS.HEIGHT - 40, width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: ((HEAP_DEFAULTS.WIDTH + 60) * 5) + (HEAP_DEFAULTS.WIDTH/2), y: -HEAP_DEFAULTS.HEIGHT - 40 + HEAP_DEFAULTS.HEIGHT/2, width: 75, height: 75, cornerRadius: 15 },
        count: 1,
        same: true,
        duo: false,
        src: "/vine/chip/104.png"
    },

    {
        id: "vineCjip",
        heap_config: { x: (HEAP_DEFAULTS.WIDTH + 60) * 6, y: -HEAP_DEFAULTS.HEIGHT - 40, width: HEAP_DEFAULTS.WIDTH, height: HEAP_DEFAULTS.HEIGHT },
        element: { x: ((HEAP_DEFAULTS.WIDTH + 60) * 6) + (HEAP_DEFAULTS.WIDTH/2), y: -HEAP_DEFAULTS.HEIGHT - 40 + HEAP_DEFAULTS.HEIGHT/2, width: 60, height: 60, cornerRadius: 15, opacity: .8 },
        count: 50,
        same: true,
        duo: false,
        src: "/vine/vine_cjip/red.png"
    },

    // {
    //     id: "dad",
    //     heap_config: { x: 0, y: -390 - HEAP_DEFAULTS.HEIGHT - 100, width: 546, height: 390 },
    //     element: { x: 0 + 546 / 2, y: -390 - HEAP_DEFAULTS.HEIGHT - 100 + 390/2, width: 516, height: 370, cornerRadius: 15 },
    //     count: 18,
    //     same: false,
    //     duo: true,
    //     flipped: true,
    //     src: "/vine/dad/"
    // },
    //
    // {
    //     id: "mom",
    //     heap_config: { x: 546 + 80, y: -390 - HEAP_DEFAULTS.HEIGHT - 100, width: 546, height: 390 },
    //     element: { x: 546 + 80 + 546 / 2, y: -390 - HEAP_DEFAULTS.HEIGHT - 100 + 390/2, width: 516, height: 370, cornerRadius: 15 },
    //     count: 18,
    //     same: false,
    //     duo: true,
    //     flipped: true,
    //     src: "/vine/mom/"
    // },

    {
        id: "plot",
        heap_config: { x: (546 + 80) + 546 + 80, y: -390 - HEAP_DEFAULTS.HEIGHT - 100, width: 273, height: 389 },
        element: { x: (546 + 80) * 2 + 273 / 2, y: -390 - HEAP_DEFAULTS.HEIGHT - 100 + 390/2, width: 253, height: 349, cornerRadius: 15 },
        count: 18,
        same: false,
        duo: true,
        flipped: true,
        src: "/vine/plot/"
    },

    {
        id: "fields",
        heap_config: { x: 0, y: -(390 * 2) - 390 - HEAP_DEFAULTS.HEIGHT - 200, width: 1173, height: 824 },
        element: { x: 1173 / 2, y: -(390 * 2) - 390 - HEAP_DEFAULTS.HEIGHT - 200 + 824/2, width: 1123, height: 794, cornerRadius: 15 },
        count: 6,
        same: false,
        duo: false,
        flipped: true,
        src: "/vine/fields/"
    },
]

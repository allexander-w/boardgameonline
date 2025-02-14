export default [
    {
        id: "boat",
        heap_config: { x: -1000, y: 0, width: 280, height: 280 },
        element: { x: -1000 + 280/2, y: 280/2, width: 248, height: 248 },
        count: 4,
        same: false,
        duo: false,

        src: "/jackal/ships/"
    },


    {
        id: "coin",
        heap_config: { x: -1000, y: 400, width: 280, height: 280 },
        element: { x: -1000 + 280/2, y: 400 + 280/2, width: 150, height: 150 },
        count: 40,
        same: true,
        duo: false,

        src: "/jackal/coin/coin.png"
    },


    {
        id: "rom",
        heap_config: { x: -1000, y: 400 * 2, width: 280, height: 280 },
        element: { x: -1000 + 280/2, y: (400 * 2) + 280/2, width: 150, height: 150 },
        count: 10,
        same: true,
        duo: false,

        src: "/jackal/rom/bottle.png"
    },

    {
        id: "pirates",
        heap_config: { x: -1000, y: 400 * 3, width: 280, height: 280 },
        element: { x: -1000 + 280/2, y: (400 * 3) + 280/2, width: 140, height: 140 },
        count: 8,
        same: false,
        duo: false,

        src: "/jackal/pirates/"
    },

    {
        id: "additional",
        heap_config: { x: -1000, y: 400 * 4, width: 280, height: 280 },
        element: { x: -1000 + 280/2, y: (400 * 4) + 280/2, width: 140, height: 140 },
        count: 8,
        same: false,
        duo: true,

        src: "/jackal/additional/"
    },

]

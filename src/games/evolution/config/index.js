export default [

    {
        namespace: "cards",

        x: 0,
        y: 0,

        element: { width: 412, height: 576, cornerRadius: 10 },

        count: 197,
        duo: false,
        same: false,
    },

    {
        namespace: "base",

        x: 532,
        y: 0,

        element: { width: 827, height: 574, cornerRadius: 10 },

        count: 4,
        duo: true,
        same: false,
    },

    {
        namespace: "continents",

        x: 532 + 827 + 40 + 80,
        y: 0,

        element: { width: 412, height: 576, cornerRadius: 10 },

        count: 6,
        duo: true,
        same: "1.png",
    },


    {
        namespace: "food",

        x: 532 + 827 + 40 + 80 + 40 + 80 + 412,
        y: 0,

        element: { width: 100, height: 100, cornerRadius: 10 },

        count: 20,
        duo: true,
        same: "1.png",
    },

    {
        namespace: "addfood",

        x: 532 + 827 + 40 + 80 + 40 + 80 + 40 + 80 + 100 + 412,
        y: 0,

        element: { width: 100, height: 100, cornerRadius: 10 },

        count: 20,
        duo: true,
        same: "1.png",
    },

    {
        namespace: "fat",

        x: 532 + 827 + 40 + 80 + 40 + 80 + 40 + 80 + 40 + 80 + 200 + 412,
        y: 0,

        element: { width: 100, height: 100, cornerRadius: 10 },

        count: 20,
        duo: true,
        same: "1.png",
    },

]

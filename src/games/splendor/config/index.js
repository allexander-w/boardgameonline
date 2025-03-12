export default [
    {
        namespace: "one",

        x: 0,
        y: 0,

        element: { width: 418, height: 578, cornerRadius: 10 },

        count: 40,
        duo: false,
        same: false,
    },

    {
        namespace: "two",

        x: 0,
        y: 578 + 40 + 20 + 20,

        element: { width: 418, height: 578, cornerRadius: 10 },

        count: 30,
        duo: false,
        same: false,
    },

    {
        namespace: "three",

        x: 0,
        y: 578 * 2 + 40 * 2 + 20 + 20,

        element: { width: 418, height: 578, cornerRadius: 10 },

        count: 20,
        duo: false,
        same: false,
    },

    {
        namespace: "tiles",

        x: 0,
        y: -500,

        element: { width: 394, height: 394, cornerRadius: 10 },

        count: 10,
        duo: true,
        same: false,
    },
]
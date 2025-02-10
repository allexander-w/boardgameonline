const serialize = object => {
    let output;

    try {
        output = JSON.stringify(object);
        return output;
    } catch(e) {
        console.log(e);
    }
};

const unserialize = string => {
    let output;

    try {
        output = JSON.parse(string);
        return output;
    } catch(e) {
        console.log(e);
    }
};

export { unserialize, serialize };
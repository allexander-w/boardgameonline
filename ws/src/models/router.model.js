class Router {
    constructor(data) {
        this.data = data;
    }

    use(action, func) {
        if ( this.data.action === action ) {
            func( this.data );
        }
    }
}

module.exports = Router;
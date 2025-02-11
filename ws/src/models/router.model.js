function Router(data) {
    return {
        use(action, func) {
            if ( data.action === action ) {
                func( data );
            }
        },

        redirect(action, users) {
            if ( data.action === action ) {
                users.forEach(u => {
                    if (u.id === data.payload.user) return false;
                    u.send(action, data.payload);
                });
            }
        }
    }

}

module.exports = Router;
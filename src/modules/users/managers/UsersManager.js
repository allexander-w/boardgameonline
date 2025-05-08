
class UsersManager {
    constructor(usersManager, uiManager) {
        this.usersManager = usersManager;
        this.uiManager = uiManager;
    }

    render() {
        const output = [];

        output.push(this.usersManager.user);

        for (const [id, cursor] of this.usersManager.users) {
            output.push(cursor.user?.user);
        }

        return this.uiManager.getActualUsersData(output);
    }
}

export default UsersManager;
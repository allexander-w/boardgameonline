
class UsersManager {
    constructor(usersManager, uiManager) {
        this.usersManager = usersManager;
        this.uiManager = uiManager;
    }

    render() {
        console.log('render users', this.usersManager.users);
        const output = [];

        output.push(this.usersManager.user);

        for (const [id, user] of this.usersManager.users) {
            output.push(user);
        }

        return this.uiManager.getActualUsersData(output);
    }
}

export default UsersManager;
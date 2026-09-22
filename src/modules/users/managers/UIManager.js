import {UsersListTemplate} from "../templates/users.template";

class UIManager {

    getActualUsersData(users, viewer) {
        return UsersListTemplate(users, viewer);
    }
}

export default UIManager;
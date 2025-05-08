import {UsersListTemplate} from "../templates/users.template";

class UIManager {

    getActualUsersData(users) {
        return UsersListTemplate(users);
    }
}

export default UIManager;
import {UsersListTemplate} from "../templates/users.template";

class UIManager {

    getActualUsersData(users, viewer, handCounts) {
        return UsersListTemplate(users, viewer, handCounts);
    }
}

export default UIManager;
const UserTemplate = (user) => {
    return `
        <div class="user-item">
            <div class="user-logo">
                <img src="/system/avatars/${ user.avatar }.png" alt="">
            </div>
            <p>${ user.name }</p>
        </div>
    `
}

export const UsersListTemplate = (users) => {
    return `
        <div class="users-list"> 
            ${ users.map(el => UserTemplate(el)).join("") } 
        </div>
    `
}
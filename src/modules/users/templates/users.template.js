const UserTemplate = (user, viewer) => {
    const canManage = viewer?.role === "host" && viewer.id !== user.id;

    return `
        <div class="user-item">

        ${
        user?.avatar
            ? `<div class="user-logo" style="background: var(--accent);"><img src="/system/avatars/${ user.avatar }.png" alt=""></div>`
            : `<div class="user-avatar" style="background: var(--accent);">${user.name[0]}</div>`
    }

            <div style="flex:1">${user.name}${ user.role === "host" ? " · хост" : "" }</div>

            ${ canManage ? `<button class="user-action" data-action="api.room.transferHost" data-target="${user.id}" title="Сделать хостом"><i class="ph ph-crown"></i></button>` : "" }
            ${ canManage ? `<button class="user-action" data-action="api.room.kick" data-target="${user.id}" title="Удалить из комнаты"><i class="ph ph-user-minus"></i></button>` : "" }

            <div class="status-dot"></div>
        </div>
    `
}

export const UsersListTemplate = (users, viewer) => {
    return `
        <div class="resources-wrapper">
            ${users.map(el => UserTemplate(el, viewer)).join("")}
        </div>
    `
}
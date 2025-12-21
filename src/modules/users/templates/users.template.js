const UserTemplate = (user) => {
    return `
        <div class="user-item">
        
        ${  
            user?.avatar 
                ? `<div class="user-logo" style="background: var(--accent);"><img src="/system/avatars/${ user.avatar }.png" alt=""></div>`
                : `<div class="user-avatar" style="background: var(--accent);">${user.name[0]}</div>`
        }
            
            <div style="flex:1">${user.name} </div>
            <div class="status-dot"></div>
        </div>
    `
}

// <div className="user-item">
//     <div className="user-logo">
//         <img src="/system/avatars/${ user.avatar }.png" alt=""/>
//     </div>
//     <p>${user.name}</p>
// </div>

export const UsersListTemplate = (users) => {
    return `
        <div class="resources-wrapper"> 
            ${users.map(el => UserTemplate(el)).join("")} 
        </div>
    `
}
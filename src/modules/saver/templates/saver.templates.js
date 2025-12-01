export const SaveButtonTemplate = `
    <div class="saver">
        <h4 style="margin-bottom: 15px; color: var(--text-muted);">Меню</h4>
        <div class="menu-list">
            <button class="menu-btn-lg" data-event="save">
                <i class="ph ph-floppy-disk"></i>
                <span>Сохранить</span>
            </button>
            <button class="menu-btn-lg" data-event="load">
                <i class="ph ph-upload-simple"></i>
                <span>Загрузить</span>
            </button>
            <button class="menu-btn-lg">
                <i class="ph ph-arrows-out"></i>
                <span>Полный экран</span>
            </button>
            <button class="menu-btn-lg">
                <i class="ph ph-question"></i>
                <span>Помощь</span>
            </button>
            
            <hr class="menu-divider">
            
            <button class="menu-btn-lg danger">
                <i class="ph ph-sign-out"></i>
                <span>Покинуть комнату</span>
            </button>
        </div>
    </div>

`
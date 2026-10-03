export const beginScreenTemplate = () => {
    return `
        <div class="begin-screen">
          <div class="modal">
            <div class="rooms-list"></div>
            <div class="games-list"></div>
            <form class="field-wrapper active">
              <input autocomplete="off" name="hidden" class="field" maxlength="256" placeholder="Имя" type="text" id="fname" required="">
              <button type="submit" class="sign">
                В игру
              </button>
            </form>
          </div>
        </div>
    `
}
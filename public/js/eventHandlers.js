export function attachEventHandlers(modalHandler) {
    const span = document.querySelector('.close');

    span.onclick = function() {
      modalHandler.close();
    }

    window.onclick = function(event) {
      if (event.target === modalHandler.modal) {
        modalHandler.close();
      }
    }
  }

class Dialog {
  constructor() {
    this.dialogs = document.querySelectorAll('dialog');
    this.dialogTogglers = document.querySelectorAll('.dialog-toggler');
    this.initialize();
  }

  initialize() {
    this.dialogTogglers.forEach(toggler => {
      toggler.addEventListener('click', () => this.handleToggleClick(toggler));
    });

    this.dialogs.forEach(dialog => {
      const closeButtons = dialog.querySelectorAll('.close');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => this.closeDialog(dialog));
      });
    });
  }

  handleToggleClick(toggler) {
    const targetDialogId = toggler.dataset.toggle;
    const targetDialog = document.getElementById(targetDialogId);

    if (targetDialog) {
      this.toggleDialog(targetDialog);

      if (targetDialog.classList.contains('auto-hide')) {
        this.setAutoHide(targetDialog);
        this.handleDialogHover(targetDialog);
      }
    } else {
      console.warn(`Dialog with ID "${targetDialogId}" not found!`);
    }
  }

  showDialog(dialog) {
    if (dialog.classList.contains('modal')) {
      dialog.showModal();
    } else {
      dialog.show();
    }
  }

  closeDialog(dialog) {
    dialog.close();
  }

  toggleDialog(dialog) {
    if (!dialog.hasAttribute('open')) {
      this.showDialog(dialog);
    } else {
      this.closeDialog(dialog);
    }
  }

  setAutoHide(dialog, autoHideTimeMs = 3600) {
    clearTimeout(dialog.hideTimeout);
    dialog.hideTimeout = setTimeout(() => this.closeDialog(dialog), autoHideTimeMs);
  }

  handleDialogHover(dialog) {
    dialog.addEventListener('pointerenter', () => {
      clearTimeout(dialog.hideTimeout);
    });

    dialog.addEventListener('pointerleave', () => {
      this.setAutoHide(dialog);
    });
  }
}

// Export an instance of Dialog to initialize it when imported
export default new Dialog();
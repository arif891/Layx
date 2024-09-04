export default function dialog() {
const dialogs = document.querySelectorAll('dialog');
const dialogTogglers = document.querySelectorAll('.dialog-toggler');

function showDialog(dialog) {
  if (dialog.classList.contains('modal')) {
    dialog.showModal();
  } else {
    dialog.show();
  }
}

function closeDialog(dialog) {
  dialog.close();
}

function toggleDialog(dialog) {
  if (!dialog.hasAttribute('open')) {
    showDialog(dialog);
  } else {
    closeDialog(dialog);
  }
}

function setAutoHide(dialog, autoHideTimeMs = 3600) {
  clearTimeout(dialog.hideTimeout);
  dialog.hideTimeout = setTimeout(() => {
    closeDialog(dialog);
  }, autoHideTimeMs);
}

function handleDialogHover(dialog) {
  dialog.addEventListener('pointerenter', () => {
    clearTimeout(dialog.hideTimeout);
  });
  dialog.addEventListener('pointerleave', () => {
    setAutoHide(dialog);
  });
}

dialogTogglers.forEach(toggler => {
  toggler.addEventListener('click', () => {
    const targetDialogId = toggler.dataset.toggle;
    const targetDialog = document.getElementById(targetDialogId);
    if (targetDialog) {
      toggleDialog(targetDialog);
      if (targetDialog.classList.contains('auto-hide')) {
        setAutoHide(targetDialog);
        handleDialogHover(targetDialog);
      }
    } else {
      console.warn(`Dialog with ID "${targetDialogId}" not found!`);
    }
  });
});

dialogs.forEach(dialog => {
  const closeButtons = dialog.querySelectorAll('.close');
  closeButtons.forEach(closeButton => {
    closeButton.addEventListener('click', () => {
      closeDialog(dialog);
    });
  });
});
};
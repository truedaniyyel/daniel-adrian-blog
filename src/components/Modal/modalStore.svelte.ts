export type ModalType = 'search' | 'tags' | null;

class ModalStore {
  activeModal = $state<ModalType>(null);

  open(modal: ModalType) {
    if (this.activeModal) {
      this.close();
    }
    document.documentElement.style.overflow = 'hidden';
    this.activeModal = modal;
  }

  close() {
    document.documentElement.removeAttribute('style');
    this.activeModal = null;
  }

  isOpen(modal: ModalType) {
    return this.activeModal === modal;
  }
}

export const modalStore = new ModalStore();

import { create } from 'zustand';

interface UserProModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useProModal = create<UserProModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useProModal;

import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isOpen: false,
    modalType: null, // 'mobile' or 'desktop'
    modalComponent: null, // 'Users', 'Listings', etc.
  },
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.modalComponent = action.payload.modalComponent;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.modalComponent = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
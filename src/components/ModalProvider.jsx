import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MobileModal as UsersMobileModal, DesktopModal as UsersDesktopModal } from './modals/UsersModal';
import { MobileModal as ListingsMobileModal, DesktopModal as ListingsDesktopModal } from './modals/ListingsModal';
import { closeModal } from '../redux/modalSlice';

const ModalProvider = () => {
  const dispatch = useDispatch();
  const { isOpen, modalType, modalComponent } = useSelector((state) => state.modal);

  const renderModal = () => {
    if (!modalComponent) return null;

    switch (modalComponent) {
      case 'Users':
        return modalType === 'mobile' ? (
          <UsersMobileModal onClose={() => dispatch(closeModal())} />
        ) : (
          <UsersDesktopModal onClose={() => dispatch(closeModal())} />
        );
      case 'Listings':
        return modalType === 'mobile' ? (
          <ListingsMobileModal onClose={() => dispatch(closeModal())} />
        ) : (
          <ListingsDesktopModal onClose={() => dispatch(closeModal())} />
        );
      default:
        return null;
    }
  };

  return isOpen ? renderModal() : null;
};

export default ModalProvider;
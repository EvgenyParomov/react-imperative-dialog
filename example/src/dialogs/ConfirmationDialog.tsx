import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DialogViewProps, createDialog } from '../../../dist';

type Settings = {
  params: {
    description: string;
  };
};

const ConfirmationModal: React.FC<DialogViewProps<Settings>> = ({
  description,
  isOpen,
  onResult,
  onClose,
}) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm action</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button onClick={onResult} variant="primary">
          Accept
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const {
  useDialog: useConfirmation,
  DialogProvider: ConfirmationProvider,
  useDialogAsync: useConfirmationAsync,
} = createDialog({
  DialogView: ConfirmationModal,
  defaultParams: {
    description: 'Do you really want to do this?',
  },
});

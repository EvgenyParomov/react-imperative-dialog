import { nanoid } from 'nanoid';
import * as React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { createDialog, DialogViewProps } from '../../../dist';
import { TodoTaskItem } from '../types/TodoTaskItem';

type DialogSettings = {
  params: {
    defaultTask?: TodoTaskItem;
  };
  result: TodoTaskItem;
};

const TodoParamsModal: React.FC<DialogViewProps<DialogSettings>> = ({
  isOpen,
  onResult,
  onClose,
  defaultTask,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    onResult({
      title: data.get('title') as string,
      id: nanoid(),
    });
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create todo item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Title</Form.Label>
            <Form.Control
              defaultValue={defaultTask?.title}
              name="title"
              type="text"
              placeholder="Enter title"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Accept
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export const {
  DialogProvider: TodoParamsDialogProvider,
  useDialogAsync: useGetTodoParams,
} = createDialog({
  DialogView: TodoParamsModal,
  defaultParams: {},
});

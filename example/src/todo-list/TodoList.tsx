import * as React from 'react';
import {
  Container,
  Button,
  ButtonGroup,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { useConfirmationAsync } from '../dialogs/ConfirmationDialog';
import { useGetTodoParams } from '../dialogs/TodoParamsDialog';
import { TodoTaskItem } from '../types/TodoTaskItem';

export const TodoList: React.FC = () => {
  const todoListState = useCollectionState([] as TodoTaskItem[]);
  const confirmation = useConfirmationAsync();
  const getTodoParams = useGetTodoParams();

  const handleDelete = async (item: TodoTaskItem) => {
    await confirmation({
      description: `Are you really want delete task "${item.title}"`,
    });
    todoListState.remove(item.id);
  };

  const handleUpdate = async (item: TodoTaskItem) => {
    const result = await getTodoParams({
      defaultTask: item,
    });
    todoListState.update(item.id, result);
  };

  const handleCreate = async () => {
    const result = await getTodoParams();
    todoListState.add(result);
  };

  const renderTodoTask = (item: TodoTaskItem) => {
    return (
      <Card body>
        <Row>
          <Col sm={9}>{item.title}</Col>
          <Col sm={3}>
            <ButtonGroup size="sm">
              <Button
                variant="outline-primary"
                onClick={() => handleUpdate(item)}
              >
                Update
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => handleDelete(item)}
              >
                Delete
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Todo list</h1>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col>
          <Button variant="primary" onClick={handleCreate}>
            Add task
          </Button>
        </Col>
      </Row>
      {todoListState.items.map(item => (
        <Row className="mb-3" key={item.id}>
          <Col>{renderTodoTask(item)}</Col>
        </Row>
      ))}
    </Container>
  );
};

function useCollectionState<T extends { id: string }>(defaultItems: T[]) {
  const [items, setItems] = React.useState(defaultItems);
  const add = (item: T) => {
    setItems(t => [...t, item]);
  };
  const remove = (id: string) => {
    setItems(t => t.filter(item => item.id !== id));
  };
  const update = (id: string, newItem: Partial<T>) => {
    setItems(t =>
      t.map(item => (item.id === id ? { ...item, ...newItem } : item))
    );
  };

  return {
    items,
    add,
    remove,
    update,
  };
}

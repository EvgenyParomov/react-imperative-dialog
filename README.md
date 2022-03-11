# React imperative dialog

Библиотека которая упрощает создание и переиспользование диалогов с пользователем.

## Примеры:

### Диалог создания и редактирования задачи

Для создания ui использован `react-bootstrap`
```tsx

type TaskItem = {
  id: string
  title: string
}

// Этот тип нужен для описание пользовательских параметров и возвращаемое значение
type DialogSettings = {
  // описывает пользовательские параметры
  params: {
    defaultTask?: TaskItem;
  };
  // описывает возвращаемый результат
  result: TaskItem;
};

const TaskParamsModal: React.FC<DialogViewProps<DialogSettings>> = ({
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
          <Modal.Title>Enter todo item params</Modal.Title>
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
```

Компонент отображения диалога, это компонент c пропсами типа `DialogViewProps`

Тип `DialogViewProps` имеет необязательный аргумент типа. 
Этот аргумент нужен, что бы определить тип пользовательских параметров (проп description в данном примере) 
или тип возвращаемого значение (передаётся как первый аргумент onResult)

- проп `onClose`: 
- проп `onClose`: 
- проп `onClose`: 







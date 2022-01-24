import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TodoList } from './todo-list/TodoList';
import { ConfirmationProvider } from './dialogs/ConfirmationDialog';
import { TodoParamsDialogProvider } from './dialogs/TodoParamsDialog';

const App = () => {
  return (
    <TodoParamsDialogProvider>
      <ConfirmationProvider>
        <TodoList />
      </ConfirmationProvider>
    </TodoParamsDialogProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

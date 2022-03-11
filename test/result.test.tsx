import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createDialog, DialogViewProps } from '../src';

describe('params', () => {
  type ModalProps = DialogViewProps<{
    params: { externalResult: string };
    result: string | undefined;
  }>;

  const onResult = jest.fn();

  const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onResult,
    externalResult,
  }) => {
    const [result, setResult] = React.useState<string>();
    const handleChangeResult = () => {
      setResult(externalResult);
    };

    const handleResult = () => {
      onResult(result);
      setResult(undefined);
    };

    if (!isOpen) {
      return null;
    }
    return (
      <div>
        Modal
        <div>{result}</div>
        <button onClick={handleChangeResult}>change result</button>
        <button onClick={handleResult}>OK</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  const { useDialog, DialogProvider, useDialogAsync } = createDialog({
    DialogView: Modal,
    defaultParams: {
      externalResult: 'externalResult',
    },
  });

  const Child: React.FC<{
    openParams?: Partial<{ externalResult: string }>;
  }> = ({ openParams }) => {
    const openCallback = useDialog();
    const openAsyncDialog = useDialogAsync();

    const handleOpenDialog = () =>
      openCallback({
        params: openParams,
        onResult,
      });

    const handleOpenAsyncDialog = async () => {
      const result = await openAsyncDialog(openParams);
      onResult(result);
    };

    return (
      <div>
        Child
        <button onClick={handleOpenDialog}>Open dialog</button>
        <button onClick={handleOpenAsyncDialog}>Open async dialog</button>
      </div>
    );
  };

  test('result works', () => {
    render(
      <DialogProvider>
        <Child />
      </DialogProvider>
    );

    fireEvent.click(screen.getByText('Open dialog'));
    fireEvent.click(screen.getByText('change result'));
    expect(screen.queryByText('externalResult')).not.toBeNull();
    fireEvent.click(screen.getByText('OK'));
    expect(onResult).toHaveBeenCalledWith('externalResult');
  });

  test('async result works', () => {
    render(
      <DialogProvider>
        <Child />
      </DialogProvider>
    );

    fireEvent.click(screen.getByText('Open async dialog'));
    fireEvent.click(screen.getByText('change result'));
    expect(screen.queryByText('externalResult')).not.toBeNull();
    fireEvent.click(screen.getByText('OK'));
    expect(onResult).toHaveBeenCalledWith('externalResult');
  });

  test('default result', () => {
    render(
      <DialogProvider>
        <Child />
      </DialogProvider>
    );

    fireEvent.click(screen.getByText('Open dialog'));
    fireEvent.click(screen.getByText('OK'));
    expect(onResult).toHaveBeenCalledWith(undefined);
  });
});

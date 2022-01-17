import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createDialog, TDialogProps } from '../src';

describe('params', () => {
  type DialogParams = { externalResult: string };
  type DialogResult = string;

  const onResult = jest.fn();

  const Modal: React.FC<TDialogProps<DialogParams, DialogResult>> = ({
    isOpen,
    onClose,
    onResult,
    externalResult,
    setResult,
    result,
  }) => {
    const handleChangeResult = () => {
      setResult(externalResult);
    };

    if (!isOpen) {
      return null;
    }
    return (
      <div>
        Modal
        <div>{result}</div>
        <button onClick={handleChangeResult}>change result</button>
        <button onClick={onResult}>OK</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  const { useDialog, DialogProvider, useDialogAsync } = createDialog({
    DialogView: Modal,
    defaultParams: {
      externalResult: 'externalResult',
    },
    defaultResult: 'defaultResult',
  });

  const Child: React.FC<{ openParams?: Partial<DialogParams> }> = ({
    openParams,
  }) => {
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
    expect(screen.queryByText('defaultResult')).not.toBeNull();
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
    expect(screen.queryByText('defaultResult')).not.toBeNull();
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
    expect(screen.queryByText('defaultResult')).not.toBeNull();
    fireEvent.click(screen.getByText('OK'));
    expect(onResult).toHaveBeenCalledWith('defaultResult');
  });

  test('result reset', () => {
    render(
      <DialogProvider>
        <Child />
      </DialogProvider>
    );

    fireEvent.click(screen.getByText('Open dialog'));
    expect(screen.queryByText('defaultResult')).not.toBeNull();
    fireEvent.click(screen.getByText('change result'));
    expect(screen.queryByText('externalResult')).not.toBeNull();
    fireEvent.click(screen.getByText('Close'));
    fireEvent.click(screen.getByText('Open dialog'));
    expect(screen.queryByText('defaultResult')).not.toBeNull();
    expect(onResult).toHaveBeenCalledWith('defaultResult');
  });
});

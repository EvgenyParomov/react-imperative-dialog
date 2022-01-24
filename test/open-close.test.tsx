import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createDialog, DialogProps } from '../src';

describe('open-close', () => {
  const onResult = jest.fn();
  const onClose = jest.fn();

  const Modal: React.FC<DialogProps<{}>> = ({ isOpen, onClose, onResult }) => {
    if (!isOpen) {
      return null;
    }
    return (
      <div>
        Modal
        <button onClick={() => onResult()}>OK</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  const { useDialog, DialogProvider, useDialogAsync } = createDialog({
    DialogView: Modal,
    defaultParams: {},
  });

  const Child = () => {
    const openCallback = useDialog();
    const openAsync = useDialogAsync();

    const handleOpenDialogAsync = async () => {
      await openAsync();
      onResult();
    };
    const handleOpenDialogAsyncThrow = async () => {
      try {
        await openAsync({ throwOnClose: true });
        onResult();
      } catch (e) {
        onClose();
      }
    };
    const handleOpenDialogCallback = async () => {
      openCallback({
        onClose,
        onResult,
      });
    };
    return (
      <div>
        Child
        <button onClick={handleOpenDialogAsync}>Open dialog async</button>
        <button onClick={handleOpenDialogAsyncThrow}>
          Open dialog async throw
        </button>
        <button onClick={handleOpenDialogCallback}>Open dialog callback</button>
      </div>
    );
  };

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('useDialog OK', () => {
    render(
      <DialogProvider>
        <Child />
      </DialogProvider>
    );

    expect(screen.queryByText('Modal')).toBeNull();

    fireEvent.click(screen.getByText('Open dialog callback'));

    expect(screen.queryByText('Modal')).not.toBeNull();

    fireEvent.click(screen.getByText('OK'));
    expect(screen.queryByText('Modal')).toBeNull();
    expect(onResult).toHaveBeenCalledTimes(1);
  });

  test('useDialog Close', () => {
    render(
      <DialogProvider>
        <Child />
      </DialogProvider>
    );

    expect(screen.queryByText('Modal')).toBeNull();

    fireEvent.click(screen.getByText('Open dialog callback'));

    expect(screen.queryByText('Modal')).not.toBeNull();

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Modal')).toBeNull();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('useDialogAsync', () => {
    render(
      <DialogProvider>
        <Child />
      </DialogProvider>
    );

    expect(screen.queryByText('Modal')).toBeNull();

    fireEvent.click(screen.getByText('Open dialog async'));

    expect(screen.queryByText('Modal')).not.toBeNull();

    fireEvent.click(screen.getByText('OK'));
    expect(screen.queryByText('Modal')).toBeNull();
    expect(onResult).toHaveBeenCalledTimes(1);
  });

  test('useDialogAsync throwOnClose', () => {
    render(
      <DialogProvider>
        <Child />
      </DialogProvider>
    );

    expect(screen.queryByText('Modal')).toBeNull();

    fireEvent.click(screen.getByText('Open dialog async throw'));

    expect(screen.queryByText('Modal')).not.toBeNull();

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Modal')).toBeNull();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

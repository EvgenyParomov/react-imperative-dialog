import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createDialog, TDialogProps } from '../src';

describe('params', () => {
  type DialogParams = {
    param1: string;
    param2: string;
  };

  const Modal: React.FC<TDialogProps<DialogParams>> = ({
    isOpen,
    onClose,
    onResult,
    param2,
    param1,
  }) => {
    if (!isOpen) {
      return null;
    }
    return (
      <div>
        Modal
        <div>{param1}</div>
        <div>{param2}</div>
        <button onClick={onResult}>OK</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  const { useDialog, DialogProvider, useDialogAsync } = createDialog({
    DialogView: Modal,
    defaultParams: {
      param1: 'defaultParam1',
      param2: 'defaultParam2',
    },
  });

  const Child: React.FC<{ openParams?: Partial<DialogParams> }> = ({
    openParams,
  }) => {
    const openCallback = useDialog();
    const openAsyncDialog = useDialogAsync();

    return (
      <div>
        Child
        <button
          onClick={() =>
            openCallback({
              params: openParams,
            })
          }
        >
          Open dialog
        </button>
        <button
          onClick={() => {
            openAsyncDialog(openParams);
          }}
        >
          Open async dialog
        </button>
      </div>
    );
  };

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('default params', () => {
    render(
      <DialogProvider>
        <Child />
      </DialogProvider>
    );

    fireEvent.click(screen.getByText('Open dialog'));
    expect(screen.queryByText('defaultParam1')).not.toBeNull();
    expect(screen.queryByText('defaultParam2')).not.toBeNull();
  });

  test('provider params', () => {
    render(
      <DialogProvider param1={'providerParam1'}>
        <Child />
      </DialogProvider>
    );

    fireEvent.click(screen.getByText('Open dialog'));
    expect(screen.queryByText('providerParam1')).not.toBeNull();
    expect(screen.queryByText('defaultParam2')).not.toBeNull();
  });

  test('open params', () => {
    render(
      <DialogProvider>
        <Child openParams={{ param1: 'openParam1' }} />
      </DialogProvider>
    );

    fireEvent.click(screen.getByText('Open dialog'));
    expect(screen.queryByText('openParam1')).not.toBeNull();
    expect(screen.queryByText('defaultParam2')).not.toBeNull();
  });

  test('open async params', () => {
    render(
      <DialogProvider>
        <Child openParams={{ param1: 'openParam1' }} />
      </DialogProvider>
    );

    fireEvent.click(screen.getByText('Open async dialog'));
    expect(screen.queryByText('openParam1')).not.toBeNull();
    expect(screen.queryByText('defaultParam2')).not.toBeNull();
  });

  test('open params priority', () => {
    render(
      <DialogProvider param1={'providerParam1'}>
        <Child openParams={{ param1: 'openParam1' }} />
      </DialogProvider>
    );

    fireEvent.click(screen.getByText('Open dialog'));
    expect(screen.queryByText('openParam1')).not.toBeNull();
    expect(screen.queryByText('defaultParam2')).not.toBeNull();
  });
});

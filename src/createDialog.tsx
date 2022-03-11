import * as React from 'react';
import {
  CreateDialogParams,
  CreateDialogResult,
  SettingsParams,
  OpenDialog,
  SettingsResult,
  SettingsOnResult,
  OpenDialogAsync,
  Callback,
} from './types';

export function createDialog<S>(
  params: CreateDialogParams<S>
): CreateDialogResult<S> {
  const defaultParams =
    (params as { defaultParams?: SettingsParams<S> }).defaultParams ?? {};
  const DialogView = params.DialogView;

  const context = React.createContext<OpenDialog<S> | null>(null);

  const useDialog = () => {
    const open = React.useContext(context);
    if (!open)
      throw new Error(
        'You can open confirmation only in children of Confirmation component'
      );
    return open;
  };

  const useDialogAsync = (): OpenDialogAsync<S> => {
    const open = useDialog();
    return React.useCallback(
      ({ throwOnClose, ...params } = {}) =>
        new Promise((res, rej) => {
          open({
            params: params as Partial<SettingsParams<S>>,
            onResult: res as SettingsOnResult<S>,
            onClose: throwOnClose ? rej : undefined,
          });
        }),
      [open]
    );
  };

  const DialogProvider: React.FC<Partial<SettingsParams<S>>> = ({
    children,
    ...rootParams
  }) => {
    const rootParamsRef = React.useRef(rootParams);
    rootParamsRef.current = rootParams;

    const [isOpen, setIsOpen] = React.useState(false);
    const [dialogParams, setDialogParams] = React.useState({
      ...defaultParams,
      ...rootParams,
    } as SettingsParams<S>);

    const handlers = React.useRef({
      onResult: noop,
      onClose: noop,
    } as {
      onResult: SettingsOnResult<S>;
      onClose: Callback;
    });

    const reset = React.useCallback(() => {
      setIsOpen(false);
      handlers.current = {
        onClose: noop,
        onResult: noop as SettingsOnResult<S>,
      };
    }, []);

    const handleResult = React.useCallback(
      (result: SettingsResult<S>) => {
        handlers.current.onResult(result);
        reset();
      },
      [reset]
    );

    const handleClose = React.useCallback(() => {
      handlers.current.onClose();
      reset();
    }, [reset]);

    const open = React.useCallback(
      ({ params, onClose = noop, onResult = noop } = {}) => {
        setIsOpen(true);
        setDialogParams({
          ...defaultParams,
          ...rootParamsRef.current,
          ...params,
        });
        handlers.current = {
          onClose,
          onResult,
        };
      },
      [rootParamsRef]
    );

    return (
      <>
        <DialogView
          isOpen={isOpen}
          onResult={handleResult as SettingsOnResult<S>}
          onClose={handleClose}
          {...dialogParams}
        />
        <context.Provider value={open}>{children}</context.Provider>
      </>
    );
  };

  return {
    useDialog,
    useDialogAsync,
    DialogProvider,
  };
}

const noop = () => {};

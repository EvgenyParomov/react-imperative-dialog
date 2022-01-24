import * as React from 'react';
import {
  OpenDialog,
  OpenDialogAsync,
  ValueCallback,
  CreateDialogResult,
  DialogProps,
} from './types';

export function createDialog<P extends {}, R = void>({
  defaultParams = {} as P,
  DialogView,
}: {
  DialogView: React.FC<DialogProps<P, R>>;
  defaultParams: P;
}): CreateDialogResult<P, R> {
  const context = React.createContext<OpenDialog<P, R> | null>(null);

  const useDialog = () => {
    const open = React.useContext(context);
    if (!open)
      throw new Error(
        'You can open confirmation only in children of Confirmation component'
      );
    return open;
  };

  const useDialogAsync = (): OpenDialogAsync<P, R> => {
    const open = useDialog();
    return React.useCallback(
      ({ throwOnClose, ...params } = {}) =>
        new Promise<R>((res, rej) => {
          open({
            params: params as Partial<P>,
            onResult: res,
            onClose: throwOnClose ? rej : undefined,
          });
        }),
      [open]
    );
  };

  const DialogProvider: React.FC<Partial<P>> = ({
    children,
    ...rootParams
  }) => {
    const rootParamsRef = React.useRef(rootParams);
    rootParamsRef.current = rootParams;

    const [isOpen, setIsOpen] = React.useState(false);
    const [params, setParams] = React.useState({
      ...defaultParams,
      ...rootParams,
    });

    const handlers = React.useRef<{
      onResult: ValueCallback<R>;
      onClose: ValueCallback;
    }>({
      onResult: () => {},
      onClose: () => {},
    });

    const reset = React.useCallback(() => {
      setIsOpen(false);
      handlers.current = { onClose: noop, onResult: noop };
    }, []);

    const handleResult = React.useCallback(
      (result: R) => {
        handlers.current.onResult(result);
        reset();
      },
      [reset]
    );

    const handleClose = React.useCallback(() => {
      handlers.current.onClose();
      reset();
    }, [reset]);

    const open: OpenDialog<P, R> = React.useCallback(
      ({ params, onClose = noop, onResult = noop }) => {
        setIsOpen(true);
        setParams({ ...defaultParams, ...rootParamsRef.current, ...params });
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
          onResult={handleResult}
          onClose={handleClose}
          {...params}
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

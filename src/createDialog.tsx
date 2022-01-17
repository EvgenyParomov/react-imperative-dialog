import * as React from 'react';
import {
  TOpenDialog,
  TOpenDialogAsync,
  TValueCallback,
  TCreateDialogResult,
  TDialogProps,
} from './types';

export function createDialog(params: {
  DialogView: React.FC<TDialogProps>;
}): TCreateDialogResult;
export function createDialog<P extends {}>(params: {
  DialogView: React.FC<TDialogProps<P>>;
  defaultParams: P;
}): TCreateDialogResult<P>;
export function createDialog<P extends {}, R = void>(params: {
  DialogView: React.FC<TDialogProps<P, R>>;
  defaultParams: P;
  defaultResult: R;
}): TCreateDialogResult<P, R>;
export function createDialog<P extends {} = {}, R = void>({
  defaultParams = {} as P,
  DialogView,
  defaultResult,
}: {
  DialogView: React.FC<TDialogProps<P, R>>;
  defaultParams?: P;
  defaultResult?: R;
}): TCreateDialogResult<P, R> {
  const context = React.createContext<TOpenDialog<P, R> | null>(null);

  const useDialog = () => {
    const open = React.useContext(context);
    if (!open)
      throw new Error(
        'You can open confirmation only in children of Confirmation component'
      );
    return open;
  };

  const useDialogAsync = (): TOpenDialogAsync<P, R> => {
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
    const [result, setResult] = React.useState(defaultResult as R);

    const handlers = React.useRef<{
      onResult: TValueCallback<R>;
      onClose: TValueCallback;
    }>({
      onResult: () => {},
      onClose: () => {},
    });

    const reset = React.useCallback(() => {
      setIsOpen(false);
      handlers.current = { onClose: noop, onResult: noop };
    }, []);

    const handleResult = React.useCallback(() => {
      handlers.current.onResult(result);
      reset();
    }, [result, reset]);

    const handleClose = React.useCallback(() => {
      handlers.current.onClose();
      reset();
    }, [reset]);

    const open: TOpenDialog<P, R> = React.useCallback(
      ({ params, onClose = noop, onResult = noop }) => {
        setIsOpen(true);
        setParams({ ...defaultParams, ...rootParamsRef.current, ...params });
        setResult(defaultResult as R);
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
          result={result}
          setResult={setResult}
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

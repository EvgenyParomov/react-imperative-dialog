import * as React from 'react';

export type TValueCallback<R = void> = (res: R) => void;
export type TCallback = () => void;

export type TDialogProps<P extends {} = {}, R = void> = {
  isOpen: boolean;
  onClose: TCallback;
  onResult: TCallback;
  result: R;
  setResult: React.Dispatch<React.SetStateAction<R>>;
} & P;

export type TOpenDialogAsync<P extends {}, R = void> = (
  params?: Partial<P> & { throwOnClose?: boolean }
) => Promise<R>;

export type TOpenDialog<P extends {}, R = void> = (options: {
  params?: Partial<P>;
  onResult?: TValueCallback<R>;
  onClose?: TCallback;
}) => void;

export type TCreateDialogResult<P extends {} = {}, R = void> = {
  useDialog: () => TOpenDialog<P, R>;
  useDialogAsync: () => TOpenDialogAsync<P, R>;
  DialogProvider: React.FC<Partial<P>>;
};

export type TCreateDialogParams<P extends {}, R = void> = {
  DialogView: React.FC<TDialogProps<P, R>>;
  defaultParams: P;
  defaultResult: R;
};

export type TCreateDialogParamsOnlyView = {
  DialogView: React.FC<TDialogProps<{}>>;
};
export type TCreateDialogParamsWithParams<P extends {}> = {
  DialogView: React.FC<TDialogProps<P>>;
  defaultParams: P;
};

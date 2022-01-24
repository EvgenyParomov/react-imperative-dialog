import * as React from 'react';

export type ValueCallback<R = void> = (res: R) => void;
export type Callback = () => void;

export type DialogProps<P extends {} = {}, R = void> = {
  isOpen: boolean;
  onClose: Callback;
  onResult: ValueCallback<R>;
} & P;

export type OpenDialogAsync<P extends {}, R = void> = (
  params?: Partial<P> & { throwOnClose?: boolean }
) => Promise<R>;

export type OpenDialog<P extends {}, R = void> = (options: {
  params?: Partial<P>;
  onResult?: ValueCallback<R>;
  onClose?: Callback;
}) => void;

export type CreateDialogResult<P extends {} = {}, R = void> = {
  useDialog: () => OpenDialog<P, R>;
  useDialogAsync: () => OpenDialogAsync<P, R>;
  DialogProvider: React.FC<Partial<P>>;
};

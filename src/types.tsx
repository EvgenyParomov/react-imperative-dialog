export type ValueCallback<R = void> = (res: R) => void;
export type Callback = () => void;

export type SettingsParams<S> = S extends { params: {} } ? S['params'] : {};
export type SettingsDefaultParams<S> = S extends { params: {} }
  ? { defaultParams: S['params'] }
  : {};
export type SettingsResult<S> = S extends { result: any } ? S['result'] : void;
export type SettingsOnResult<S> = S extends { result: any }
  ? ValueCallback<S['result']>
  : Callback;

export type DialogViewProps<S = {}> = {
  isOpen: boolean;
  onClose: Callback;
  onResult: SettingsOnResult<S>;
} & SettingsParams<S>;

export type OpenDialogAsync<S> = (
  params?: Partial<SettingsParams<S>> & { throwOnClose?: boolean }
) => Promise<SettingsResult<S>>;

export type OpenDialog<S> = (options?: {
  params?: Partial<SettingsParams<S>>;
  onResult?: SettingsOnResult<S>;
  onClose?: Callback;
}) => void;

export type CreateDialogParams<S> = {
  DialogView: React.FC<DialogViewProps<S>>;
} & SettingsDefaultParams<S>;

export type CreateDialogResult<S> = {
  useDialog: () => OpenDialog<S>;
  useDialogAsync: () => OpenDialogAsync<S>;
  DialogProvider: React.FC<Partial<SettingsParams<S>>>;
};

export type LockScriptContextType = {
  lockScript: string | null;
  saveLockScript: (script: string) => void;
};

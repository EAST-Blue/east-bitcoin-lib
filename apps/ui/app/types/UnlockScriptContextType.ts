export type UnlockScriptContextType = {
  unlockScript: string | null;
  saveUnlockScript: (script: string | null | undefined) => void;
};

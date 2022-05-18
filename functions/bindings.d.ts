export {};

declare global {
  type Envtest = {
    TODOS_STORAGE:KVNamespace
  }
  
  const MY_ENV_VAR: string;
  const MY_SECRET: string;
  const TODOS_STORAGE: KVNamespace;
}
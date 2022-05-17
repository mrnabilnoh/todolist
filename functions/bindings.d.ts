export {};

declare global {
  const TODOS_STORAGE: KVNamespace<"TODOS_STORAGE">;
  const TODOSV2_STORAGE: KVNamespace;
}
export {};

declare global {
  type ENV = {
    TODOS_STORAGE:KVNamespace
  }
}
export {};

declare global {
  type ENV = {
    TODOS_STORAGE:KVNamespace
  };
  type TODO = {
    id: number
    name: string
    completed: boolean
  };
  type TODO_META = {
    text: string,
  }
  type TODO_LIST = {
    text: string,
    items: TODO[]
  }
}
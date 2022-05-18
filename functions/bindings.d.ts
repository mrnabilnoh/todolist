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
    reference_id: string
    text: string
  }
  type TODO_LIST = {
    id: string
    text: string
    items: TODO[]
  }
}
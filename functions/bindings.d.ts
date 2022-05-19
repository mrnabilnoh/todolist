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
    session: string,
    reference_id: string
    text: string
  }
  type TODO_LIST = {
    id: string
    text: string
    items: TODO[]
  }
  type TODO_NEW = {
    title: string
  }
}
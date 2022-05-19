type TodoItem = {
  id: number;
  name: string;
  completed: boolean;
};
type TodoItemMeta = {
  reference_id: string;
  title: string;
};
type TodoItemListing = {
  id: string;
  title: string;
  items: TodoItem[];
};

type TodoRequestPostData = {
  title: string;
};

type TodoPagesFunction<
  Env = {
    KV_TODO_SESSION: KVNamespace;
    KV_TODO_ITEM: KVNamespace;
  },
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (context: EventContext<Env, Params, Data>) => Response | Promise<Response>;

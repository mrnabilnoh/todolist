type TodoItem = {
  id: number;
  text: string;
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

type TodoRequestNewData = {
  title: string;
};

type TodoRequestPostData = {
  item: TodoItem;
};

type TodoRequestPutData = {
  item: TodoItem;
};

type TodoRequestDeleteData = {
  id: number;
  delete_parent: boolean;
};

type TodoPagesFunction<
  Env = {
    KV_TODO_SESSION: KVNamespace;
    KV_TODO_ITEM: KVNamespace;
  },
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (context: EventContext<Env, Params, Data>) => Response | Promise<Response>;

export const onRequest: TodoPagesFunction = async () => {
  return new Response("405 Method Not Allowed", {
    status: 405,
  });
};

export const onRequestGet: TodoPagesFunction = async ({ request, env, params }) => {
  const todoItemKey = params.id as string

  // handle invalid id
  if(todoItemKey == null || todoItemKey.length !== 10) {
    return new Response(JSON.stringify({
      message: "404 Not Found"
    }), { status : 404});
  }

  // get todo items associate with current todoItemKey
  const todoItems = await env.KV_TODO_ITEM.get<TodoItem[]>(todoItemKey, { type: "json" });
  return new Response(JSON.stringify(todoItems));
};

export const onRequestPut: TodoPagesFunction = async ({ request, env, params }) => {
  const todoItemKey = params.id as string

  // handle invalid id
  if(todoItemKey == null || todoItemKey.length !== 10) {
    return new Response(JSON.stringify({
      message: "404 Not Found"
    }), { status : 404});
  }

  // get todo items associate with current todoItemKey
  const todoItems = await env.KV_TODO_ITEM.get<TodoItem[]>(todoItemKey, { type: "json" });
  return new Response(JSON.stringify(todoItems));
};


export const onRequestDelete: TodoPagesFunction = async ({ request, env, params }) => {
  const todoItemKey = params.id as string

  // handle invalid id
  if(todoItemKey == null || todoItemKey.length !== 10) {
    return new Response(JSON.stringify({
      message: "404 Not Found"
    }), { status : 404});
  }

  // get todo items associate with current todoItemKey
  const todoItems = await env.KV_TODO_ITEM.get<TodoItem[]>(todoItemKey, { type: "json" });
  return new Response(JSON.stringify(todoItems));
};
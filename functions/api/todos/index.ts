import { customAlphabet, urlAlphabet } from "nanoid";
const nanoid = customAlphabet(urlAlphabet, 10);

const defaultTodoItem: TodoItem = {
  id: 1,
  name: "Sample Todo items.",
  completed: false,
};

export const onRequestGet: TodoPagesFunction = async ({ request, env }) => {
  const clientIp: string = request.headers.get("CF-Connecting-IP");
  const todoSessionKey: string = `todo::${clientIp}`;

  // get current todo item listing (if exist) from Cloudflare KV data store.
  let todoSessionItem = (await env.KV_TODO_SESSION.get(todoSessionKey, {
    type: "json",
  })) as string[];

  // if todoSessionItem equal to 'null', then we assume clientIp is a new session.
  // proceed to create new todo list with example data.
  if (todoSessionItem == null) {
    // generate new unique id (this uniqueId is used for url shortlink)
    const uniqueId = nanoid();
    todoSessionItem = [uniqueId];
    // update user todo item listing
    await env.KV_TODO_SESSION.put(todoSessionKey, JSON.stringify(todoSessionItem));
    // update user todo item
    await env.KV_TODO_ITEM.put(uniqueId, JSON.stringify([defaultTodoItem]), {
      metadata: {
        reference_id: uniqueId,
        title: defaultTodoItem.name,
      } as TodoItemMeta,
    });
  }

  // retrieve all todo item associate with current clientIp
  let todoItems = [] as TodoItemListing[];
  for (const idx in todoSessionItem) {
    const { value, metadata } = await env.KV_TODO_ITEM.getWithMetadata<
      TodoItem[],
      TodoItemMeta
    >(todoSessionItem[idx], { type: "json" });
    if (value != null) {
      todoItems.push({
        id: metadata.reference_id,
        title: metadata.title,
        items: value,
      });
    }
  }

  return new Response(JSON.stringify(todoItems));
};

export const onRequestPost: TodoPagesFunction = async ({ request, env }) => {
  const requestData = (await request.json()) as TodoRequestPostData;
  const clientIp : string = request.headers.get("CF-Connecting-IP");
  const todoSessionKey: string = `todo::${clientIp}`;
  // generate new unique id (this uniqueId is used for url shortlink)
  const uniqueId : string = nanoid();
  
  // get current todo item listing (if exist) from Cloudflare KV data store.
  let todoSessionItem = (await env.KV_TODO_SESSION.get(todoSessionKey, {
    type: "json",
  })) as string[];
  if (todoSessionItem == null) {
    todoSessionItem = [uniqueId];
  } else {
    todoSessionItem.push(uniqueId);
  }

  // update user todo item listing
  await env.KV_TODO_SESSION.put(todoSessionKey, JSON.stringify(todoSessionItem));
  // update user todo item
  await env.KV_TODO_ITEM.put(uniqueId, "[]", {
    metadata: {
      reference_id: uniqueId,
      title: requestData.title,
    } as TodoItemMeta,
  });

  return new Response(
    JSON.stringify({
      reference_id: uniqueId,
      title: requestData.title,
    })
  );
};

export const onRequest: TodoPagesFunction = async () => {
  return new Response("405 Method Not Allowed", {
    status: 405,
  });
};

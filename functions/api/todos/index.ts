import { customAlphabet, urlAlphabet } from "nanoid";
import { ResponseJsonMethodNotAllowed } from "../../helper";
const nanoid = customAlphabet(urlAlphabet, 10);

const defaultTodoItem: TodoItem = {
  id: 1,
  text: "Sample Todo items.",
  completed: false,
};

export const onRequest = ResponseJsonMethodNotAllowed

export const onRequestGet: TodoPagesFunction = async ({ request, env }) => {
  const clientIp: string = request.headers.get("CF-Connecting-IP");
  const todoSessionKey: string = `todo::${clientIp}`;

  // get current todo session (if exist) from Cloudflare KV data store.
  let todoSession = (await env.KV_TODO_SESSION.get(todoSessionKey, {
    type: "json",
  })) as string[];

  // if todoSession equal to 'null', then we assume clientIp is a new session.
  // proceed to create new todo list with example data.
  if (todoSession == null) {
    // generate new unique id (this uniqueId is used for url shortlink)
    const uniqueId = nanoid();
    todoSession = [uniqueId];
    // update todo session record with new session
    await env.KV_TODO_SESSION.put(
      todoSessionKey,
      JSON.stringify(todoSession)
    );
    // create new todo list with example todo item
    await env.KV_TODO_ITEM.put(uniqueId, JSON.stringify([defaultTodoItem]), {
      metadata: {
        reference_id: uniqueId,
        title: defaultTodoItem.text,
      } as TodoItemMeta,
    });
  }

  // retrieve all todo list associate with current clientIp
  let todoItems = [] as TodoItemListing[];
  for (const idx in todoSession) {
    const { value, metadata } = await env.KV_TODO_ITEM.getWithMetadata<
      TodoItem[],
      TodoItemMeta
    >(todoSession[idx], { type: "json" });
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
  const requestData = (await request.json()) as TodoRequestNewData;
  const clientIp: string = request.headers.get("CF-Connecting-IP");
  const todoSessionKey: string = `todo::${clientIp}`;
  // generate new unique id (this uniqueId is used for url shortlink)
  const uniqueId: string = nanoid();

  // get current todo session (if exist) from Cloudflare KV data store.
  let todoSession = (await env.KV_TODO_SESSION.get(todoSessionKey, {
    type: "json",
  })) as string[];
  if (todoSession == null) {
    todoSession = [uniqueId];
  } else {
    todoSession.push(uniqueId);
  }

  // update todo session record with new session
  await env.KV_TODO_SESSION.put(
    todoSessionKey,
    JSON.stringify(todoSession)
  );
  // create new todo item with empty record
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

import {
  ResponseJsonBadRequest,
  ResponseJsonMethodNotAllowed,
  ResponseJsonNotFound,
} from "../../helper";

export const onRequest = ResponseJsonMethodNotAllowed;

export const onRequestGet: TodoPagesFunction = async ({ env, params }) => {
  const todoItemKey = params.id as string;

  // handle invalid id
  if (todoItemKey == null || todoItemKey.length !== 10) {
    return ResponseJsonNotFound();
  }

  // get todo item record associate with current todoItemKey
  const todoItems = await env.KV_TODO_ITEM.get<TodoItem[]>(todoItemKey, {
    type: "json",
  });

  return new Response(JSON.stringify({ results: todoItems || [] }));
};

export const onRequestPost: TodoPagesFunction = async ({
  request,
  env,
  params,
}) => {
  const todoItemKey = params.id as string;
  // handle invalid todoItemKey
  if (todoItemKey == null || todoItemKey.length !== 10) {
    return ResponseJsonNotFound();
  }

  // get todo item record associate with current todoItemKey
  const { value, metadata } = await env.KV_TODO_ITEM.getWithMetadata<
    TodoItem[],
    TodoItemMeta
  >(todoItemKey, {
    type: "json",
  });
  const todoItems = value;
  if (todoItems == null) {
    return ResponseJsonNotFound();
  }

  // only proceed to get requestData if it pass todoItemKey check
  const requestData = (await request.json()) as TodoRequestPostData;
  const todoItem = requestData.item as TodoItem;
  if (
    todoItem == null ||
    todoItem.id == null ||
    todoItem.text == null ||
    todoItem.completed == null ||
    todoItem.text.length === 0
  ) {
    return ResponseJsonBadRequest();
  }

  // generate new todo item id, by getting the current highest id in data store plus 1
  todoItem.id = Math.max(...todoItems.map((elem) => elem.id), 0) + 1;
  todoItems.push(todoItem);

  // update todo item record with new todo item
  await env.KV_TODO_ITEM.put(todoItemKey, JSON.stringify(todoItems), {
    metadata: metadata,
  });

  return new Response(JSON.stringify(todoItem));
};

export const onRequestPut: TodoPagesFunction = async ({
  request,
  env,
  params,
}) => {
  const todoItemKey = params.id as string;
  // handle invalid todoItemKey
  if (todoItemKey == null || todoItemKey.length !== 10) {
    return ResponseJsonNotFound();
  }

  // get todo item record associate with current todoItemKey
  const { value, metadata } = await env.KV_TODO_ITEM.getWithMetadata<
    TodoItem[],
    TodoItemMeta
  >(todoItemKey, {
    type: "json",
  });
  const todoItems = value;
  if (todoItems == null) {
    return ResponseJsonNotFound();
  }

  // only proceed to get requestData if it pass todoItemKey check
  const requestData = (await request.json()) as TodoRequestPutData;
  const todoItem = requestData.item as TodoItem;

  if (
    todoItem == null ||
    todoItem.id == null ||
    todoItem.text == null ||
    todoItem.completed == null ||
    todoItem.id === 0 ||
    todoItem.text.length === 0
  ) {
    return ResponseJsonBadRequest();
  }

  let todoItemFound: boolean;
  for (let idx = 0; idx < todoItems.length; idx++) {
    // update todo item record
    if (todoItems[idx].id === todoItem.id) {
      todoItems[idx].text = todoItem.text;
      todoItems[idx].completed = todoItem.completed;
      todoItemFound = true;
      break;
    }
  }

  // handle invalid todoItem id
  if (!todoItemFound) {
    return ResponseJsonBadRequest();
  }

  // update todo item record
  await env.KV_TODO_ITEM.put(todoItemKey, JSON.stringify(todoItems), {
    metadata: metadata,
  });

  return new Response(JSON.stringify(todoItem));
};

export const onRequestDelete: TodoPagesFunction = async ({
  request,
  env,
  params,
}) => {
  const todoItemKey = params.id as string;
  // handle invalid todoItemKey
  if (todoItemKey == null || todoItemKey.length !== 10) {
    return ResponseJsonNotFound();
  }

  // get todo item record associate with current todoItemKey
  const { value, metadata } = await env.KV_TODO_ITEM.getWithMetadata<
    TodoItem[],
    TodoItemMeta
  >(todoItemKey, {
    type: "json",
  });
  const todoItems = value;
  if (todoItems == null) {
    return ResponseJsonNotFound();
  }

  // only proceed to get requestData if it pass todoItemKey check
  const requestData = (await request.json()) as TodoRequestDeleteData;
  if (requestData == null) {
    return ResponseJsonBadRequest();
  }

  if (requestData.delete_parent) {
    await env.KV_TODO_ITEM.delete(todoItemKey);
    // clear all todo item record
    todoItems.splice(0, todoItems.length);
  } else if (requestData.id > 0) {
    const todoItemId = requestData.id;
    let todoItemFound: boolean;
    for (let idx = 0; idx < todoItems.length; idx++) {
      // update todo item record
      if (todoItems[idx].id === todoItemId) {
        todoItems.splice(idx, 1);
        todoItemFound = true;
        break;
      }
    }

    // handle invalid todoItem id
    if (!todoItemFound) {
      return ResponseJsonBadRequest();
    }

    // update todo item record
    await env.KV_TODO_ITEM.put(todoItemKey, JSON.stringify(todoItems), {
      metadata: metadata,
    });
  } else {
    // if all option not match, then there are nothing to delete
    return ResponseJsonBadRequest();
  }

  return new Response(JSON.stringify({ results: todoItems || [] }));
};

import { customAlphabet, urlAlphabet } from 'nanoid'
const nanoid = customAlphabet(urlAlphabet, 10)

// default value for TODO item
const DEFAULT_TODO : TODO = {
  id: 1,
  name: 'Sample Todo items.',
  completed: false,
};

/**
 * @param  {} request: Http Request
 * @param  {} env: Cloudflare Environment
 * @returns Promise
 */
export const onRequestGet: PagesFunction<ENV> = async ({request, env}) : Promise<Response> =>  {
    // get client IP from Cloudflare meta header.
    const ip : string = request.headers.get('CF-Connecting-IP');
    const storeKey : string = `store-${ip}`;
  
    // get current todo list link (if exist) based on 'ip session' in Cloudflare KV data store.
    let data = await env.TODOS_STORAGE.get(storeKey, { type: "json"}) as string[];
    /**
     * if data equal to 'null', then we assume this 'ip' is a new session.
     * proceed to create sample todo list item for example.
     */
    if (data == null) {
        // generate new unique id for sample todo list link
        const uniqueId = nanoid();
        data = [uniqueId];
        // store new todo link short link in Cloudflare KV data store
        await env.TODOS_STORAGE.put(storeKey, JSON.stringify(data));
        // store new todo item in Cloudflare KV data store
        await env.TODOS_STORAGE.put(uniqueId, JSON.stringify([DEFAULT_TODO]), { metadata:  {
          session: storeKey,
          reference_id: uniqueId,
          text: "Sample Todo list"
        } as TODO_META });
    }

    // retrieve all todo list associate with current 'ip session'
    let items = [] as TODO_LIST[];
    for (const idx in data) {
      const {value, metadata} = await env.TODOS_STORAGE.getWithMetadata<TODO[],TODO_META>(data[idx], { type: "json"});
      if (value != null) {
        items.push({
          id: metadata.reference_id,
          text: metadata.text,
          items: value
        })
      }
    }
    
    return new Response(JSON.stringify(items));
}

export const onRequestPost: PagesFunction<ENV> = async ({request, env}) : Promise<Response> =>  {
    const json = await request.json() as TODO_NEW;
  
    // get client IP from Cloudflare meta header.
    const ip : string = request.headers.get('CF-Connecting-IP');
    const storeKey : string = `store-${ip}`;
    // generate new unique id for sample todo list link
    const uniqueId = nanoid();
    
    // get current todo list link (if exist) based on 'ip session' in Cloudflare KV data store.
    let data = await env.TODOS_STORAGE.get(storeKey, { type: "json"}) as string[];
    if (data == null) {
      data = [uniqueId]
    } else {
      data.push(uniqueId)
    }

    // store new todo link short link in Cloudflare KV data store
    await env.TODOS_STORAGE.put(storeKey, JSON.stringify(data));
    // store new todo item in Cloudflare KV data store
    await env.TODOS_STORAGE.put(uniqueId, "[]", { metadata:  {
      session: storeKey,
      reference_id: uniqueId,
      text: json.title
    } as TODO_META });

    return new Response(JSON.stringify({
      reference_id: uniqueId,
      title: json.title
    }))
}

// handle other HTTP method request
export const onRequest: PagesFunction<ENV> = async () : Promise<Response> =>  {
  return new Response("405 Method Not Allowed", {
    status: 405
  })
}
import { nanoid } from 'nanoid'


// default value for TODO item
const defaultData : TODO = {
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
        const uniqueId = nanoid(6);
        data = [uniqueId];
        // store new todo link short link in Cloudflare KV data store
        await env.TODOS_STORAGE.put(storeKey, JSON.stringify(data));
        // store new todo item in Cloudflare KV data store
        await env.TODOS_STORAGE.put(uniqueId, JSON.stringify([defaultData]), { metadata:  {
          text: "Sample Todo list"
        } as TODO_META });
    }

    let items = [];
    for (const idx in data) {
      const {value, metadata} = await env.TODOS_STORAGE.getWithMetadata<TODO[],TODO_META>(data[idx], { type: "json"});
      items.push(value)
      items.push(metadata)
      if (value != null) {
        items.push({
          text: metadata.text,
          items: value
        })
      }
    }
    
    return new Response(JSON.stringify(items));
}
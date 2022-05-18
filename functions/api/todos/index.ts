import { nanoid } from 'nanoid'


// Default TODO item
const defaultData : TODO = {
  id: 1,
  name: 'Sample Todo items.',
  completed: false,
};

/**
 * @param  {} {request
 * @param  {} env}
 * @returns Promise
 */
export const onRequestGet: PagesFunction<ENV> = async ({request, env}) : Promise<Response> =>  {
    /**
     * Get Client IP from Cloudflare meta header.
     * This will help to split user by ip session.
     * @param  {} 'CF-Connecting-IP'
     */
    const ip : string = request.headers.get('CF-Connecting-IP');
    const storeKey : string = `store-${ip}`;
  
    // get current ip session todo list link (if exist) in Cloudflare KV data store.
    let data = await env.TODOS_STORAGE.get(storeKey, { type: "json"}) as string[];
    if (data == null) {
        // generate new unique id for sample todo list link
        const uniqueId = nanoid(6);
        data = [uniqueId];
        // store new todo link in Cloudflare KV data store
        await env.TODOS_STORAGE.put(storeKey, JSON.stringify(data));
        // store new todo item in Cloudflare KV data store
        await env.TODOS_STORAGE.put(uniqueId, JSON.stringify([defaultData]), { metadata:  {
          text: "Sample Todo list"
        } as TODO_META });
    }

    let items = [] as TODO_LIST[];
    for (const key in data) {
      const {value, metadata} = await env.TODOS_STORAGE.getWithMetadata<TODO[],TODO_META>(key, { type: "json"});
      if (value != null) {
        items.push({
          text: metadata.text,
          items: value
        })
      }
    }
    
    return new Response(JSON.stringify(items));
}
const defaultData = {
   todos: [
     {
       id: 1,
       name: 'Sample Todo items messages.',
       completed: false,
     },
   ],
 };
/**
 * @param  {} {request
 * @param  {} env}
 * @returns Promise
 */
export const onRequestGet: PagesFunction<ENV> = async ({request, env}) : Promise<Response> =>  {
    /**
     * @param  {} 'CF-Connecting-IP' Store Real Client IP
     */
    const ip = request.headers.get('CF-Connecting-IP');
    const myKey = `data-${ip}`;
  
    let data = await env.TODOS_STORAGE.get(myKey, { type: "json"});
    if (!data) {
        await env.TODOS_STORAGE.put(myKey, JSON.stringify(defaultData));
        data = defaultData;
    }
    return new Response(JSON.stringify(data));
}
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
   try {
      /**
       * @param  {} 'CF-Connecting-IP' Store Real Client IP
       */
      const ip = request.headers.get('CF-Connecting-IP');
      const myKey = `data-${ip}`;
   
      let data;
      const values = await env.TODOS_STORAGE.get(myKey);
      if (!values) {
         await env.TODOS_STORAGE.put(myKey, JSON.stringify(defaultData));
         data = defaultData;
      } else {
         data = JSON.parse(values);
      }
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
      return new Response(err, { status: 500 });
    }
}
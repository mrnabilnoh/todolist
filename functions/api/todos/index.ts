type Env = {
   TODOS_STORAGE:KVNamespace
}

export const onRequestGet: PagesFunction<Env> = async ({env}) : Promise<Response> =>  {
   // Contents of context object
   const value = await env.TODOS_STORAGE.get("dedSYekRZGE");

   return new Response(value);
}
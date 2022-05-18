
export const onRequestGet: PagesFunction<Envtest> = async ({env}) : Promise<Response> =>  {
   // Contents of context object
   const value = await env.TODOS_STORAGE.get("dedSYekRZGE");

   return new Response(value);
}
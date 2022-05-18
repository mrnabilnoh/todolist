
export const onRequestGet: PagesFunction<Envtest> = async ({env}) : Promise<Response> =>  {
   // Contents of context object
   const value = await env.TODOS_STORAGE.get("dedSYekRZGE");
   const value2 = await TODOS_STORAGE.get("dedSYekRZGE");

   return new Response(value + " : " + value2);
}
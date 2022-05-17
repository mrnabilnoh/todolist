export const onRequestGet: PagesFunction<{}> = async (context:any) =>  {
   // Contents of context object
   const value = await context.env.TODOS_STORAGE.get("dedSYekRZGE");

   return new Response(value);
}
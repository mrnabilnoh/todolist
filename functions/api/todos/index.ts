export async function onRequestGet({request:Request}): Promise<Response> {
   const value = await TODOS_STORAGE.get("dedSYekRZGE");

   return new Response(value);
}
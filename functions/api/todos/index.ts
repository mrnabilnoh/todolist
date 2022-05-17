export async function onRequestGet({request:Request}) {
   const value = await TODOS.list();
   return new Response(JSON.stringify(value.keys)) 
}
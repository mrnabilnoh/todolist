export async function onRequestGet({request:Request}): Promise<Response> {
   const json = await TODOS_STORAGE.list();
   return new Response(JSON.stringify(json), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
}
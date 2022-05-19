export const onRequest: TodoPagesFunction = async () => {
  return new Response("405 Method Not Allowed", {
    status: 405,
  });
};

export const onRequestGet: TodoPagesFunction = async ({ request, env, params }) => {
  const clientIp: string = request.headers.get("CF-Connecting-IP");

  return new Response(JSON.stringify({
      clientIp: clientIp,
      param: params
  }));
};
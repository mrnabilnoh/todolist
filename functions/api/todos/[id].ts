export const onRequest: TodoPagesFunction = async () => {
  return new Response("405 Method Not Allowed", {
    status: 405,
  });
};

export const onRequestGet: TodoPagesFunction = async ({ request, env, params }) => {
  const clientIp: string = request.headers.get("CF-Connecting-IP");

  // handle invalid id
  if(params.id == null || params.id.length < 10) {
    return new Response(JSON.stringify({
      message: "404 Not Found"
    }), { status : 404});
  }

  return new Response(JSON.stringify({
      clientIp: clientIp,
      param: params.id
  }));
};
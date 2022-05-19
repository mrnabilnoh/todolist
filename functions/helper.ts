export const ResponseJsonBadRequest = () : Response => {
    return new Response(JSON.stringify({
      message: "400 Bad Request"
    }), { status : 400});
};

export const ResponseJsonNotFound = () : Response => {
    return new Response(JSON.stringify({
      message: "404 Not Found"
    }), { status : 404});
};

export const ResponseJsonMethodNotAllowed = () : Response => {
    return new Response(JSON.stringify({
      message: "405 Method Not Allowed"
    }), { status : 405});
};
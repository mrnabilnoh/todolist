const errorHandler = async ({ next }) => {
    try {
        const response = await next() as Response;
        response.headers.set('X-Hello', 'Hello from functions Middleware Error Handler!');
        response.headers.set('content-type', 'application/json;charset=UTF-8')
        return response;
    } catch (err) {
        return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }
};

export const onRequest = [errorHandler];
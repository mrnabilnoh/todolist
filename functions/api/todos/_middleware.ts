/**
 * Middleware handler to catch all error in 'api/todos' functions
 * All error trigger by functions inside 'api/todos' folder will be catch by this function
 * @param  {} {next}
 * @returns Promise
 */
const errorHandler = async ({ next }) : Promise<Response> => {
    try {
        const response = await next() as Response;
        return response;
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message, stack: err.stack, error: err }), { status: 500 })
    }
};

const headerInjector = async ({ next }) : Promise<Response> => {
    const response = await next() as Response;
    // always return response as 'application/json'
    response.headers.set('content-type', 'application/json;charset=UTF-8')
    return response;
};

export const onRequestGet = [errorHandler, headerInjector];
export const onRequestPost = [errorHandler, headerInjector];
export const onRequest = [errorHandler, headerInjector];
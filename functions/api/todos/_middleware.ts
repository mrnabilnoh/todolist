/**
 * Middleware handler to catch all error in 'api/todos' functions
 * @param  {} {next}
 * @returns Promise
 */
const errorHandler = async ({ next }) : Promise<Response> => {
    try {
        const response = await next() as Response;
        
        // Always return data in json format.
        response.headers.set('content-type', 'application/json;charset=UTF-8')
        return response;
    } catch (err) {
        return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }
};

export const onRequest = [errorHandler];
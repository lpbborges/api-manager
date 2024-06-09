export type NetworkErrorOptions = {
    response: Response;
    responseData: unknown;
};
export declare class NetworkError extends Error {
    response: Response;
    responseData: unknown;
    constructor(message: string, options: NetworkErrorOptions);
}
export declare function fetchWithError(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
export declare function parseResponse(response: Response): Promise<any>;

import {QueryClient} from "@tanstack/react-query";
import {COOKIES} from "@/utils/cookies";
import {ENV} from "@/utils/env";
import Cookies from "js-cookie";
import {ResRequest} from "@/hooks/model";

const METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE"
}

export interface HttpRequest {
    uri: string,
    options?: RequestInit
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false, // Không tự động refetch khi đổi tab
        }
    }
})

const httpRequest = async ({uri, options}: HttpRequest) => {
    const start = Date.now();

    if (options) {
        const body = options?.body;
        const isFormDataBody = body instanceof FormData;

        const headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);

        if (!isFormDataBody) {
            headers.set("Content-Type", "application/json");
        }

        const authToken = Cookies.get(COOKIES.TOKEN);
        if (authToken) {
            headers.set("Authorization", `Bearer ${authToken}`);
        }

        options.headers = headers;
        options.body = options.method === "GET" ? undefined : body;
    }

    try {
        const response = await fetch((ENV.VITE_ENDPOINT_API || "") + uri, options);

        if (response && response.ok) {
            return response;
        }

        // Xử lý lỗi trước khi reject
        let errorJson: ResRequest<null>;
        try {
            errorJson = await response.json(); // Parse lỗi trước khi reject
        } catch {
            errorJson = {message: "Unknown error", r: response.status, data: null, errors: null};
        }

        if (response.status === 401) Cookies.remove(COOKIES.TOKEN);

        console.error("API Request failed: ", response);
        return Promise.reject(errorJson);
    } catch (error) {
        const msg = "API Request failed exception: " + error;
        console.error(msg);
        return Promise.reject({
            message: msg,
            r: 500,
            data: null,
            errors: null
        } as ResRequest<null>);
    } finally {
        console.log(`API Request ${uri} took ${Date.now() - start}ms`);
    }
}

const httpGet = ({uri, options}: HttpRequest) => {
    let queryString = "";
    if (options?.body) {
        let searchParams = options.body;

        try {
            if (!(searchParams instanceof URLSearchParams)) {
                const queryParams = new URLSearchParams();
                Object.entries(JSON.parse(searchParams as string)).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach((value) => {
                            queryParams.append(key, value);
                        });
                    } else {
                        queryParams.set(key, value as string || "");
                    }
                });
                searchParams = queryParams;
            }
        } catch (error) {
            console.error("Failed to parse params: ", error);
        }

        queryString = `?${searchParams.toString()}`;
    }

    return httpRequest({
        uri: uri + queryString,
        options: {
            method: METHOD.GET,
            ...options
        }
    });
}

const httpPost = ({uri, options}: HttpRequest) => {
    return httpRequest({
        uri: uri,
        options: {method: METHOD.POST, ...options}
    });
}

const httpPut = ({uri, options}: HttpRequest) => {
    return httpRequest({
        uri: uri,
        options: {method: METHOD.PUT, ...options}
    });
}

const httpDelete = ({uri, options}: HttpRequest) => {
    return httpRequest({
        uri: uri,
        options: {method: METHOD.DELETE, ...options}
    });
}

const httpPatch = ({uri, options}: HttpRequest) => {
    return httpRequest({
        uri: uri,
        options: {method: METHOD.PATCH, ...options}
    });
}

export {
    METHOD,
    queryClient,
    httpGet,
    httpPost,
    httpPut,
    httpPatch,
    httpDelete
}
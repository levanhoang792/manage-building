import {QueryClient} from "@tanstack/react-query";
import {COOKIES} from "@/utils/cookies";
import {ENV} from "@/utils/env";
import Cookies from "js-cookie";

const METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
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

        if (response.status === 401) Cookies.remove(COOKIES.TOKEN);

        console.error("API Request failed: ", response);
        return Promise.reject(response);
    } catch (error) {
        console.error("API Request failed exception: ", error);
        return Promise.reject(error);
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

export {
    METHOD,
    queryClient,
    httpGet,
    httpPost,
    httpPut,
    httpDelete
}
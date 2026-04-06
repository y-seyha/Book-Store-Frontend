import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

export function createBrowserApiClient(): AxiosInstance {
    const client = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000",
        withCredentials: true,
    });

    client.interceptors.request.use((config) => {
        return config;
    });

    client.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            // Example: handle 401 globally
            if (error.response?.status === 401) {
                console.warn("Unauthorized! You might want to redirect to login.");
            }
            return Promise.reject(error);
        }
    );

    return client;
}


export async function apiGet<T>(
    client: AxiosInstance,
    url: string,
    config?: AxiosRequestConfig
): Promise<T> {
    const response = await client.get<T>(url, config);
    return response.data; // directly return backend response
}

export async function apiPost<TBody, TResponse>(
    client: AxiosInstance,
    url: string,
    body: TBody,
    config?: AxiosRequestConfig
): Promise<TResponse> {
    console.log("POST request to:", url, "with body:", body);
    const response = await client.post<TResponse>(url, body, config);
    return response.data;
}


export async function apiPatch<TBody, TResponse>(
    client: AxiosInstance,
    url: string,
    body: TBody,
    config?: AxiosRequestConfig
): Promise<TResponse> {
    const response = await client.patch<TResponse>(url, body, config);
    return response.data;
}
import React, { useCallback, useEffect, useState } from 'react'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

const baseUri = 'https://localhost:5001'

const createBody = (
    options: RequestInit,
    headers: Headers
): FormData | string | null => {
    const contentType = headers.get('Content-Type')
    if (
        options.body &&
        contentType &&
        contentType.includes('application/json')
    ) {
        return JSON.stringify(options.body)
    }
    if (options.body instanceof FormData) {
        return options.body
    }
    return null
}

// export interface ApiResponse<T>{
//     data: T,
//     responseCode: number,
//     errorMessage: string,
//     successMessage?: string,
//     isValid: boolean
// }

const createAuthorization = (token?: string): object =>
    token ? { Authorization: `Bearer ${token}` } : {}

const createContentType = (options: RequestInit): object => {
    let headerType: string = ''

    if (options && options.body && options.body instanceof FormData) {
        headerType = 'multipart/form-data'
    }

    if (options && typeof options.body === 'object') {
        headerType = 'application/json'
    }
    return headerType ? { 'Content-Type': headerType } : {}
}

export function useFetch(
    method: Method,
    url: string,
    options: RequestInit,
    immediate?: boolean
) {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const uri: string = `${baseUri}${url}`
    const { body, ...restOptions } = options

    const headers: Headers = new Headers({
        ...createContentType(options),
        ...createAuthorization(),
        ...options.headers,
    })

    const config = new Request(uri, {
        ...restOptions,
        body: createBody(options, headers),
        headers,
        method,
        credentials: 'include',
    })

    const executeFetch = useCallback(async () => {
        setIsLoading(true)
        setData(null)
        setError(null)
        await fetch(config)
            .then((response) => response.json())
            .then((response) => setData(response))
            .catch((err) => setError(err))
            .finally(() => setIsLoading(false))
    }, [url, options, data, error, isLoading])

    useEffect(() => {
        if (immediate) {
            executeFetch()
        }
    }, [executeFetch, immediate])
    return { data, error, isLoading, executeFetch }
}


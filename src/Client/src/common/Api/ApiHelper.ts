export interface ApiResponse<T>{
    data: T,
    responseCode: number,
    errorMessage?: string,
    isValid: boolean
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

type Options = {
    headers?: { [key: string]: string }
    baseUri?: string
    body?: object | string | FormData
}

// const baseUri = 'http://localhost:5000'
const baseUri = 'https://localhost:5001'

/**
 * @param Method - 'GET' | 'POST' | 'PUT' | 'DELETE'
 * @param Url - strig
 * @param Options - object
 */
export function apiRequest<T>(method: Method, url: string, options: Options = {}): Promise<ApiResponse<T>> {

    const uri: string = `${options.baseUri || baseUri}${url}`
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

    return fetch(config).then((resp: Response) => {
        return resp.json()
    }).then((data: ApiResponse<T>) => {
        return Promise.resolve<ApiResponse<T>>(data)
    }).catch((error: Error) =>{
        return Promise.reject(error)
    })
}

const createBody = (options: Options, headers: Headers): FormData | string | null => {
    const contentType = headers.get('Content-Type')
    if (options.body && contentType && contentType.includes('application/json')) {
        const json =  JSON.stringify(options.body)
        return json
    }
    if (options.body instanceof FormData) {
        return options.body
    }
    return null
}

const createAuthorization = (token?: string): object =>
    token ? { Authorization: `Bearer ${token}` } : {}

const createContentType = (options: Options): object => {
    let headerType: string = ''

    if (options && options.headers && options.headers['Content-Type']) {
        headerType = options.headers['Content-Type']
    }

    if (options && options.body && options.body instanceof FormData) {
        headerType = 'multipart/form-data'
    }

    if (options && typeof options.body === 'object') {
        headerType = 'application/json'
    } else {
        headerType = (options.headers && options.headers['Content-Type']) || ''
    }
    return headerType ? { 'Content-Type': headerType } : {}
}
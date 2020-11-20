import { ApiResponse, apiRequest } from '../common/Api/ApiHelper'

class AccountRepository {
    public async login<T>(login: string, password: string): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', '/account/login', {
            body: { login, password },
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }

    public async register<T>(login: string, password: string): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', '/account/register', {
            body: { login, password  },
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }

    public logout(): Promise<Response> {
        return fetch('https://localhost:5001/account/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}

const accountRepository = new AccountRepository()

export default accountRepository

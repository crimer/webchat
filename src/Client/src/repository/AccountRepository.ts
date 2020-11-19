import { ApiResponse, apiRequest } from '../common/Api/ApiHelper'

class AccountRepository {
    public login(name: string): Promise<Response> {
        return fetch('https://localhost:5001/account/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        })
    }
    // public async login<T>(name: string): Promise<ApiResponse<T>> {
    //     const response = await apiRequest<T>('POST', '/account/login', {
    //         body: { name: name },
    //         headers: { 'Content-Type': 'application/json' },
    //     })
    //     return response
    // }

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

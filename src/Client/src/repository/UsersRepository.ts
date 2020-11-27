import { ApiResponse, apiRequest } from '../common/Api/ApiHelper'

class UsersRepository {
    public async searchUsersByLogin<T>(login: string): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/user/searchUsersByLogin/${login}`)
        return response
    }
}

const usersRepository = new UsersRepository()

export default usersRepository

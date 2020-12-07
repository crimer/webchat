import { ApiResponse, apiRequest } from '../common/Api/ApiHelper'

class UsersRepository {
    public async searchUsersByLogin<T>(login: string): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/user/searchUsersByLogin/${login}`)
        return response
    }

    public async getUserProfile<T>(userId: number): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/user/getUserProfile/${userId}`)
        return response
    }
}

const usersRepository = new UsersRepository()

export default usersRepository

import { ApiResponse, apiRequest } from '../common/Api/ApiHelper'
import { ChangeUserPasswordDto } from '../common/Dtos/User/UserDtos'

class UsersRepository {
    public async searchUsersByLogin<T>(login: string): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/user/searchUsersByLogin/${login}`)
        return response
    }

    public async getUserProfile<T>(userId: number): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/user/getUserProfile/${userId}`)
        return response
    }

    public async changeUserPassword<T>(changeUserPasswordDto: ChangeUserPasswordDto): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', `/user/changeUserPassword`, {
            body: { ...changeUserPasswordDto },
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }
}

const usersRepository = new UsersRepository()

export default usersRepository

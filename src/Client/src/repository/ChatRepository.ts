import { ApiResponse, apiRequest } from '../common/Api/ApiHelper'
import { CreateChatDto } from '../common/Dtos/Chat/ChatDtos'

class ChatRepository {
    public async getMessagesByChatId<T>(chatId: number): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/message/getChatMessagesById/${chatId}`)
        return response
    }

    public async getChatsByUserId<T>(userId: number): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/chat/getChatsByUserId/${userId}`)
        return response
    }

    public async getDetailChatInfo<T>(chatId: number): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/chat/detailChatInfo/${chatId}`)
        return response
    }

    public async createNewChat<T>(createChatDto: CreateChatDto): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', `/chat/createNewChat`, {
            body:{ ...createChatDto },
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }

}

const chatRepository = new ChatRepository()

export default chatRepository

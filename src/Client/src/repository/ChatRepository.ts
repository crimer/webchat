import { ApiResponse, apiRequest } from '../common/Api/ApiHelper'

class ChatRepository {
    public async getMessagesByChatId<T>(chatId: number): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/message/getChatMessagesById/${chatId}`)
        return response
    }

}

const chatRepository = new ChatRepository()

export default chatRepository

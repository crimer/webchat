import { ApiResponse, apiRequest } from '../common/Api/ApiHelper'

class ChatRepository {
    public getMessagesByChatId(chatId: number): Promise<Response> {
        return fetch(`https://localhost:5001/message/getChatMessagesById/${chatId}`, {
            method: 'GET',
            credentials: 'include',
        })
    }
    // public async login<T>(name: string): Promise<ApiResponse<T>> {
    //     const response = await apiRequest<T>('POST', '/account/login', {
    //         body: { name: name },
    //         headers: { 'Content-Type': 'application/json' },
    //     })
    //     return response
    // }

}

const chatRepository = new ChatRepository()

export default chatRepository

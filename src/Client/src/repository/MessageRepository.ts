import { ApiResponse, apiRequest } from '../common/Api/ApiHelper'

class MessageRepository {
    public async togglePinMessage<T>(messageId: number, isPin: boolean): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', '/message/togglePinMessage', {
            body: { messageId, isPin },
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }


}

const messageRepository = new MessageRepository()

export default messageRepository

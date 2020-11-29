import { ApiResponse, apiRequest } from '../common/Api/ApiHelper'
import { ChangeChatNameDto, CreateChatDto, InviteMembersDto } from '../common/Dtos/Chat/ChatDtos'

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
    public async inviteMembersToChat<T>(inviteMembersDto: InviteMembersDto): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', `/chat/inviteMembersToChat`, {
            body:{ ...inviteMembersDto },
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }

    public async changeChatName<T>(changeChatNameDto: ChangeChatNameDto): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', `/chat/changeChatName`, {
            body:{ ...changeChatNameDto },
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }

}

const chatRepository = new ChatRepository()

export default chatRepository

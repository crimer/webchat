import { ApiResponse, apiRequest } from '../common/Api/ApiHelper'
import { ChangeChatNameDto, ChangeUserRoleDto, CreateChatDto, CreateDirectChatDto, InviteMembersDto, LeaveChatDto, ReturnToChatDto } from '../common/Dtos/Chat/ChatDtos'

class ChatRepository {
    public async getMessagesByChatId<T>(chatId: number): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/message/getChatMessagesById/${chatId}`)
        return response
    }

    public async getPinnedMessagesByChatId<T>(chatId: number): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/message/getPinnedMessagesByChatId/${chatId}`)
        return response
    }

    public async getChatsByUserId<T>(userId: number): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/chat/getChatsByUserId/${userId}`)
        return response
    }

    public async getChatsToReturnByUserId<T>(userId: number): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('GET', `/chat/getChatsToReturnByUserId/${userId}`)
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

    public async returnToChat<T>(returnToChatDto: ReturnToChatDto): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', `/chat/returnToChat`, {
            body:{ ...returnToChatDto },
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

    public async changeMemberRole<T>(changeUserRoleDto: ChangeUserRoleDto): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', `/chat/changeMemberRole`, {
            body:{ ...changeUserRoleDto },
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }

    public async leaveChat<T>(leaveChatDto: LeaveChatDto): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', `/chat/leaveChat`, {
            body:{ ...leaveChatDto },
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }

    public async kikUserFromChat<T>(kikUserFromChatDto: LeaveChatDto): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', `/chat/kikUserFromChat`, {
            body:{ ...kikUserFromChatDto },
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }

    public async createDirectChat<T>(createDirectChatDto: CreateDirectChatDto): Promise<ApiResponse<T>> {
        const response = await apiRequest<T>('POST', `/chat/createDirectChat`, {
            body:{ ...createDirectChatDto },
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }

}

const chatRepository = new ChatRepository()

export default chatRepository

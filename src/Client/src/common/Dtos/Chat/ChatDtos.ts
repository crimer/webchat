import { UserRole } from '../User/UserDtos'

export enum ChatType {
    Group = 1,
    Channel = 2,
    Direct = 3,
}

export type CreateChatDto = {
    chatName: string
    chatTypeId: number
    userCreatorId: number
    mediaId?: number
}

export type UserChatDto = {
    id: number
    name: string
    chatType: ChatType
    mediaPath: string
    mediaId: number
    userRoleId: UserRole
}

export type ChatDetailDto = {
    id: number
    name: string
    members: UserChatDto[]
}

export type InviteMembersDto = {
    chatId: number
    userIds: number[]
}

export type ChangeChatNameDto = {
    userId: number,
    chatId: number,
    newName: string,
}
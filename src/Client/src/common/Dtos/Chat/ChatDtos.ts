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
}

export type UserChatDto = {
    id: number
    name: string
    chatType: ChatType
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
    userId: number
    chatId: number
    newName: string
}

export type ChangeUserRoleDto = {
    userId: number
    chatId: number
    userRoleId: number
}

export type LeaveChatDto = {
    userId: number
    chatId: number
}
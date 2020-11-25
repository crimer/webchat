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
    mediaPath: string,
    mediaId: number,
}

export type DetailChatDto = {
    id: number,
    name: string,
    // members: a
}
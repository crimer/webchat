export type SendMessageDto = {
    text: string
    userId: number
    chatId: number
    mediaId?: number | null
    replyId?: number | null
}

export type ReciveMessageDto = {
    id: number,
    userName: string
    text: string
    isMy: boolean
    createdAt: number
    isPinned: boolean
}
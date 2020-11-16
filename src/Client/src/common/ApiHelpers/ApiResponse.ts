export interface ApiResponse<T> {
    responseCode: number
    errorMessage: string
    data?: T
    isValid: boolean
}

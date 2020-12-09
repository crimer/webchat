export enum UserRole {
    Administrator = 1,
    Manager = 2,
    Member = 3,
}

export type AuthUserDto = {
    id: number
    login: string
}

export type UserProfileDto = {
    id: number
    login: string
    password: string
}
export type ChangeUserPasswordDto = {
    userLogin: string
    userOldPassword: string
    userNewPassword: string
}

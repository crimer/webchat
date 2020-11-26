export enum UserRole {
    Administrator = 1,
    Manager = 2,
    Member = 3,
}

export type AuthUserDto = {
    id: number
    login: string
    role: UserRole
}

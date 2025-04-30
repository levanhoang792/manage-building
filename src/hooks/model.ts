export type ResRequest<T, U = null> = {
    r: number
    message: string
    data: T
    errors: U
}
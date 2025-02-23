export const isEditor = (userId?: string | null) => {
    return userId === process.env.NEXT_PUBLIC_EDITOR_ID;
}
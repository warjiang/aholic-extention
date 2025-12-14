export interface Session {
    id: string,
    summary: string,
    messageCount: number,
    lastActivity: string,
    cwd: string,
    lastUserMessage: string | null,
    lastAssistantMessage: string
}

export interface Project {
    name: string,
    path: string,
    displayName: string,
    fullPath: string,
    isCustomName: boolean,
    sessions: Session
}
type ConvoPayload = {
    conversation_history: Array<{
        user: string
        therapist: string
    }>
}

type ConvoEntry = {
    id: string,
    title: string 
    summary: string 
    analysis: string
}

export type DailyAnnoymousUserPrompt = {
    user_text: string,
    emotion: string 
    latitude: number, 
    longitude: number, 
    prompt: string
}

export type AnnoymousUserPrompts = {
    prompts: Array<DailyAnnoymousUserPrompt>
}


export type CollectiveRequestPayload = {
    user_text: string,
    emotion: string,
    prompt: string
}

export type DailyPromptRequestPayload = {
    prompt: string,
    emotion: string
}

export type SubmitAIPromptPayload = {
    user_message: string
    conversation_history: ConvoPayload
}

export type SaveConvoEntryPayload = {
    conversation_history: ConvoPayload
}


export type ConvoEntriesPayload = {
    entries: Array<ConvoEntry>
}
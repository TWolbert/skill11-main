// Type definitions that exactly match the server responses
export type Response = {
    status: Status,
    message: string
}

export type Status = "success" | "fail";

export type RegisterResponse = {
    status: Status,
    message: string,
    token: string,
    user_id: number
}

export type User = {
    user_id: number,
    email: string,
    updated: boolean,
    token: string,
    password_hash: string
}
export type userContext = { user: User | undefined, setUser: React.Dispatch<React.SetStateAction<User>> | undefined }

export type StartupsResponse = {
    status: Status,
    message: string,
    startups: [Startup]
}

export type StartupResponse = {
    status: string,
    message: string,
    startup: Startup
}

export type Startup = {
    startup_id: number,
    startup_name: string,
    startup_tagline: string,
    startup_location: string,
    startup_description: string,
    startup_category: string
    startup_logo_filename: string
}

export type StartupWithResults = {
    startup_id: number,
    startup_name: string,
    startup_tagline: string,
    startup_location: string,
    startup_description: string,
    startup_category: string
    startup_logo_filename: string
    concept_points: number,
    presentation_points: number
}

export type ResultsResponse = {
    status: Status,
    message: string,
    startups: [StartupWithResults],
    total: {
        concept: number,
        presentation: number
    }
}
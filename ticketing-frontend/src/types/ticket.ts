export type TicketStatus = | "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"

export type TicketPriority = | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export interface Ticket {
    id: number
    title: string
    description: string
    status: TicketStatus
    priority: TicketPriority
    category_id: number
    created_by_id: number
    assigned_to_id: number | null
    created_at: string
    updated_at: string
}

export interface TicketListResponse{
    items: Ticket[]
    total: number
    page: number
    page_size: number
    total_pages: number
}


export interface TicketCreate{
    title: string
    description: string
    priority: TicketPriority
    category_id: number
}
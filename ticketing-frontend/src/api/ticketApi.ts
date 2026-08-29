import api from "./axios"
import type { Ticket, TicketCreate, TicketListResponse } from "../types/ticket"

export async function getTickets(page: number = 1, pageSize: number = 10): Promise<TicketListResponse>{
    const response = await api.get<TicketListResponse>("/tickets", {
        params:{
            page, page_size: pageSize,
        },
    })
    return response.data
}

export async function getTicket(id: number): Promise<Ticket>{
    const response = await api.get<Ticket>(`/tickets/${id}`)
    return response.data
}


export async function createTicket(data: TicketCreate): Promise<Ticket>{
    const response = await api.post<Ticket>("/tickets", data)
    return response.data
}
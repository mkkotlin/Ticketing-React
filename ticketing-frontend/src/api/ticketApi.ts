import api from "./axios"
import type { Ticket, TicketCreate, TicketListResponse, Comment, TicketStatus } from "../types/ticket"

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


export async function getComments(ticketId: number):Promise<Comment[]>{
    const response = await api.get<Comment[]>(`/tickets/${ticketId}/comments`)
    return response.data
}


export async function createComment(ticketId: number, content: string): Promise<Comment>{
    const response = await api.post<Comment>(`/tickets/${ticketId}/comments`, {
        content,
    })
    return response.data
}


export async function updateTicketStatus(ticketId: number, status: TicketStatus):Promise<Ticket>{
    const response = await api.patch<Ticket>(`/tickets/${ticketId}`, {
        status
    })
    return response.data
}


export async function assignTicket(
  ticketId: number,
  agentId: number
): Promise<Ticket> {
  const response = await api.post<Ticket>(
    `/tickets/${ticketId}/assign`,
    {
      agent_id: agentId,
    }
  );

  return response.data;
}
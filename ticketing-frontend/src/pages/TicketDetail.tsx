import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getTicket } from "../api/ticketApi"
import type { Ticket } from "../types/ticket"


export default function TicketDetail(){
    const { id } = useParams()

    const [ticket, setTicket] = useState<Ticket | null>(null)

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")

    useEffect(()=>{
        async function loadTicket(){
            if (!id) return;

            try {
                const data = await getTicket( Number(id))
                setTicket(data)
            } catch {
                setError("Ticket not found")
            } finally{
                setLoading(false)
            }
        }
        loadTicket()
    }, [id] )

    if (loading){
        return <p>Loading...</p>
    }
    if (error || !ticket){
        return(
            <div>
                <p>{error || "Ticket not found"}</p>
                <Link to="/tickets">
                    Back to tickets
                </Link>
            </div>
        )
    }
    return(
        <div>
            <Link to="/tickets"> ◀️ Back</Link>
            <h1>{ticket.title}</h1>
            <p>{ticket.description}</p>
            <p>Status: {ticket.status}</p>
            <p>Priority: {ticket.priority}</p>
            <p>Assigned Agent:{" "}{ticket.assigned_to_id ?? "Unassigned"}</p>
        </div>
    )
}
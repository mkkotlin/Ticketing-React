import { useEffect, useState } from "react"
import { getTickets } from "../api/ticketApi"
import type { Ticket } from "../types/ticket"
import { Link } from "react-router-dom";



export default function Tickets(){
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect( () => {
        async function loadTickets(){
            setLoading(true)
            setError("")

            try {
                const data = await getTickets(page, 10)

                setTickets(data.items)
                setTotalPages(data.total_pages)
            } catch {
                setError("Unable to load tickets")
            } finally{
                setLoading(false)
            }
        }
        loadTickets()
    }, [page])

    if (loading){
        return <p>Loading tickets...</p>
    }
    if (error){
        return <p>{error}</p>
    }
    return (
        <>
            <div>
                <h1>Tickets</h1>
                <Link to="/tickets/new">Create Ticket</Link>
                {tickets.length === 0 ? (<p>No tickets found.</p>):(
                    <ul>
                        {tickets.map((ticket) => (
                            <li key={ticket.id}>
                                <Link to={`/tickets/${ticket.id}`}>
                                    <strong>{ticket.title}</strong>
                                </Link>

                                <div>
                                    Status: {ticket.status}
                                </div>

                                <div>
                                    Priority: {ticket.priority}
                                </div>
                            </li>
                        ) )}
                    </ul>
                )}
                <div>
                    <button disabled={page == 1} onClick={() => setPage(page - 1)}>
                        Previous
                    </button>
                    <span>
                        {" "}page {page} of {totalPages}{" "}
                    </span>

                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            </div>
        </>
    )

}
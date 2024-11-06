import "./App.css";
import {  useState, useEffect } from 'react'

type Ticket = {
  id: number;
  title: string;
  content: string;
}

const App = () => {

  const [tickets, setNotes] = useState<Ticket[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // State to control the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setContent("");
    setSelectedTicket(null);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/tickets"
        );

        const tickets: Ticket[] =
          await response.json();

        setNotes(tickets);
      } catch (e) {
        console.log(e);
      }
    }

    fetchTickets();
  }, [])

  const handleTicketClick = (ticket: Ticket) => {
    setIsModalOpen(true);
    setSelectedTicket(ticket);
    setTitle(ticket.title);
    setContent(ticket.content);
  };

  const handleAddTicket = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/tickets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const newTicket = await response.json();

      setNotes([newTicket, ...tickets]);
      setTitle("");
      setContent("");
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateTicket = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!selectedTicket) {
      return;
    }

    try{  
      const response = await fetch(
        `http://localhost:5000/api/tickets/${selectedTicket.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );
      const updatedTicket = await response.json();
      const updatedTicketsList = tickets.map((ticket) => (ticket.id === selectedTicket.id ? updatedTicket : ticket));
    
      setNotes(updatedTicketsList);
      setTitle("");
      setContent("");
      setSelectedTicket(null);
      setIsModalOpen(false);
    } catch (e){
        console.log(e)
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTitle("");
    setContent("");
    setSelectedTicket(null);
  };

  const deleteNote = async (event: React.MouseEvent, ticketId: number) => {
    event.stopPropagation();
  
    try {
      await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`,
        {
          method: "DELETE",
        }
      );
      const updatedTickets = tickets.filter(
        (ticket) => ticket.id !== ticketId
      );
      setNotes(updatedTickets);
    } catch (e) {
      console.log(e);
    }
  
  };


  return (
    <div className="app-container">
    <div className="add-div">
    {/* Button to trigger the modal */}
    <button className="add-ticket-cls" onClick={openModal}>Add Ticket</button>

    </div>
      <div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              {/* Close button at the top right */}
              <button onClick={closeModal} className="close-button">×</button>

              {selectedTicket ? <h2> Update Ticket </h2> : <h2> Add Ticket </h2>}
              <form className="ticket-form" onSubmit={(event) => (selectedTicket ? handleUpdateTicket(event) : handleAddTicket(event))}>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Title"
                  required
                ></input>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Content"
                  rows={10}
                  required
                ></textarea>

                {selectedTicket ? (
                    <div className="edit-buttons">
                      <button type="submit">Update</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </div>
                  ) : (
                    <button type="submit">Save</button>
                  )}
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="tickets-grid">
        {tickets.map((ticket) => (
          <div className="ticket-item"  onClick={() => handleTicketClick(ticket)}>
            <div className="tickets-header">
            <button onClick={(event) => deleteNote(event, ticket.id)}>x</button>
            </div>
            <h2>{ticket.title}</h2>
            <p>{ticket.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    position: 'relative',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
};




export default App;
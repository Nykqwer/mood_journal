const SERVER = "http://localhost:5000";


export async function fetchNotes() {
  const res = await fetch(SERVER);

    if(!res.ok){
        throw new Error("Failed to fetch notes");
    }

  return res.json();
}
export async function createNote(note) {
        const res = await fetch(`${SERVER}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });

        if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to save note");
  }

  return res.json();
    
}


export async function deleteNote(id) {
    const res = await fetch(`${SERVER}/${id}`, {
      method: "DELETE",
    });
        if (!res.ok) {
      throw new Error("Failed to delete note");
    }
    
}
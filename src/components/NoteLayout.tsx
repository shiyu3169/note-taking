import { Navigate, Outlet, useOutletContext, useParams } from 'react-router-dom'
import { RawNote, useNoteContext } from '../providers/NoteProvider'

const NoteLayout = () => {
  const { id } = useParams()
  const {
    state: { notes },
  } = useNoteContext()
  const note = notes.find((note) => note.id === id)
  if (!note) return <Navigate to='/' replace />

  return <Outlet context={note} />
}

export default NoteLayout

export const useNote = () => {
  return useOutletContext<RawNote>()
}

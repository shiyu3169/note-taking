import {
  NoteActionType,
  RawNoteData,
  useNoteContext,
} from '../providers/NoteProvider'
import NoteFrom from './NoteForm'
import { useNavigate } from 'react-router-dom'

function NewNote() {
  const { dispatch } = useNoteContext()
  const navigate = useNavigate()
  const handleSubmit = (note: RawNoteData) => {
    dispatch({
      type: NoteActionType.CREATE_NOTE,
      payload: {
        note,
      },
    })
    navigate('..')
  }

  return (
    <>
      <h1 className='mb-4'>New Note</h1>
      <NoteFrom handleSubmit={handleSubmit} />
    </>
  )
}

export default NewNote

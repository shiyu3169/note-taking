import { useNavigate } from 'react-router-dom'
import {
  NoteActionType,
  RawNoteData,
  useNoteContext,
} from '../providers/NoteProvider'
import NoteFrom from './NoteForm'
import { useNote } from './NoteLayout'

function EditNote() {
  const oldNote = useNote()
  const { dispatch } = useNoteContext()
  const navigate = useNavigate()
  const handleSubmit = (note: RawNoteData) => {
    dispatch({
      type: NoteActionType.UPDATE_NOTE,
      payload: {
        id: oldNote.id,
        note,
      },
    })
    navigate('..')
  }
  return (
    <>
      <h1 className='mb-4'>Edit Note</h1>
      <NoteFrom
        handleSubmit={handleSubmit}
        title={oldNote.title}
        tagIds={oldNote.tagIds}
        markdown={oldNote.markdown}
      />
    </>
  )
}

export default EditNote

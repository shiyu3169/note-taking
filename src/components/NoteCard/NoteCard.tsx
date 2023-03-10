import { Badge, Card, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useNoteContext } from '../../providers/NoteProvider'
import styles from './NoteCard.module.css'

type NoteCardProps = {
  id: string
  title: string
  tagIds: string[]
}

const NoteCard = ({ id, title, tagIds }: NoteCardProps) => {
  const {
    state: { tags },
  } = useNoteContext()
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className='align-items-center justify-content-center h-100'
        >
          <span className='fs-5'>{title}</span>
          {tagIds.length > 0 && (
            <Stack
              gap={1}
              direction='horizontal'
              className='justify-content-center flex-wrap'
            >
              {tagIds.map((id) => {
                const tag = tags[id]
                return (
                  tag && (
                    <Badge className='text-truncate' key={id}>
                      {tag}
                    </Badge>
                  )
                )
              })}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  )
}

export default NoteCard

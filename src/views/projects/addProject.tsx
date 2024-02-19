// ** React Imports
import { Ref, useState, forwardRef, ReactElement, MouseEvent, Fragment } from 'react'
import { useAuth } from 'src/hooks/useAuth'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'

import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

interface AddProjectProps {
  onRefresh: () => void
}

const AddProject: React.FC<AddProjectProps> = ({ onRefresh }) => {
  const auth = useAuth()

  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState('')

  const saveProject = async () => {
    try {
      const response = await auth.saveProjectDetails({ projectName })
      if (response.success) {
        onRefresh()
      }
      console.log(response)
    } catch (error) {
      console.log('Error saving the Project Details:', error)
    }
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    saveProject()
    setOpen(false)
    setProjectName('')
  }
  return (
    <>
      <Card sx={{ width: '13rem', minHeight: '15rem', height: 'auto' }}>
        <CardContent
          sx={{
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button variant='contained' onClick={handleOpen} style={{ marginBottom: '1rem' }}>
              <AddOutlinedIcon style={{ fontSize: '4rem' }} />
            </Button>
            <span>Add Project</span>
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm' scroll='body'>
        <DialogTitle>New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Project Name'
            type='text'
            sx={{ width: '30rem' }}
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSave} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddProject

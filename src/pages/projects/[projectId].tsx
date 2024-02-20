import {
  Button,
  Card,
  IconButton,
  TextField,
  Box,
  CardHeader,
  Divider,
  Popover,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox
} from '@mui/material'
import { useRouter } from 'next/router'
import { projectData } from 'src/types/apps/projectTypes'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import React, { useEffect, useState } from 'react'
import {} from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import ErrorIcon from '@mui/icons-material/Error'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'

interface ProjectState {
  projectId: string
  apiKey: string
  apiSecret: string
  projectName: string
}

const initialState: ProjectState = {
  projectId: '',
  apiKey: '',
  apiSecret: '',
  projectName: ''
}

const projectDetails = () => {
  const [projectState, setProjectState] = useState<ProjectState>(initialState)
  const auth = useAuth()
  const router = useRouter()
  const { projectData } = router.query
  const project: projectData = projectData ? JSON.parse(projectData as string) : null

  const goBack = () => {
    router.back()
  }

  if (!project)
    return (
      <div>
        <Button onClick={goBack}>Go Back</Button>
      </div>
    )
  const [anchorEl, setAnchorEl] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [consentToDelete, setConsentToDelete] = useState(false)

  const copyValue = (value: any) => {
    navigator.clipboard.writeText(value)
    toast.success('copied!')
  }

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteButtonClick = () => {
    setOpenDialog(true)
    handlePopoverClose()
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setConsentToDelete(false)
  }

  const deleteProject = async () => {
    try {
      const response = await auth.deleteProject(project.projectId)
      if (response.success === true) {
        toast.success(response.message)
        router.back()
      }
      console.log(response)
    } catch (error) {
      console.log('Error saving the Project Details:', error)
    }
  }

  const getProjectById = async () => {
    try {
      const response = await auth.getProjectById(project.projectId)
      if (response.success === true) {
        setProjectState({
          projectId: response.data.projectId,
          apiKey: response.data.apiKey,
          apiSecret: response.data.apiSecret,
          projectName: response.data.projectName
        })
      }
    } catch (error) {
      console.log('Error fetching project details:', error)
    }
  }

  useEffect(() => {
    getProjectById()
  }, [projectState])

  const handleConfirmDelete = () => {
    deleteProject()
    handleCloseDialog()
  }

  //   useEffect(() => {
  //     goBack(); // Call goBack function on component mount (page refresh)
  //   }, []); // Empty dependency array to run the effect only once

  return (
    <>
      <Button onClick={goBack} sx={{ marginBottom: '1rem' }}>
        Go Back
      </Button>
      <Card sx={{ width: '70rem' }}>
        <CardHeader
          title='Project Information'
          action={
            <div>
              <IconButton onClick={handlePopoverOpen}>
                <MoreHorizIcon />
              </IconButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                <Button startIcon={<DeleteIcon />} onClick={handleDeleteButtonClick}>
                  Delete
                </Button>
              </Popover>
            </div>
          }
        />
        <Divider />
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5rem', marginBottom: '1rem' }}>
            <Typography variant='body1' sx={{ width: '12rem' }}>
              Project Name
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
              {projectState.projectName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5rem', marginBottom: '1rem' }}>
            <Typography variant='body1' sx={{ width: '12rem' }}>
              Project ID
            </Typography>
            <TextField
              variant='outlined'
              size='small'
              value={projectState.projectId}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={() => copyValue(projectState.projectId)} size='small'>
                    <FileCopyIcon />
                  </IconButton>
                )
              }}
              sx={{ width: '30rem' }} // Adjust the width of the text field
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5rem', marginBottom: '1rem' }}>
            <Typography variant='body1' sx={{ width: '12rem' }}>
              Client ID
            </Typography>
            <TextField
              variant='outlined'
              size='small'
              value={projectState.apiKey}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={() => copyValue(projectState.apiKey)} size='small'>
                    <FileCopyIcon />
                  </IconButton>
                )
              }}
              sx={{ width: '30rem' }} // Adjust the width of the text field
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5rem', marginBottom: '1rem' }}>
            <Typography variant='body1' sx={{ width: '12rem' }}>
              Client Secret
            </Typography>
            <TextField
              variant='outlined'
              size='small'
              value={projectState.apiSecret}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={() => copyValue(projectState.apiSecret)} size='small'>
                    <FileCopyIcon />
                  </IconButton>
                )
              }}
              sx={{ width: '30rem' }} // Adjust the width of the text field
            />
          </Box>
          {/* Add more project details here */}
        </CardContent>
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='md' fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ErrorIcon sx={{ color: 'red' }} />
                <Typography variant='subtitle1'>Delete Project</Typography>
              </Box>
              <IconButton onClick={handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5rem', marginBottom: '1rem' }}>
              <Typography variant='body1' sx={{ width: '10rem' }}>
                Project Name
              </Typography>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                {projectState.projectName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5rem', marginBottom: '1rem' }}>
              <Typography variant='body1' sx={{ width: '10rem' }}>
                Project ID
              </Typography>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                {projectState.projectId}
              </Typography>
            </Box>
            <Divider sx={{ marginBottom: '1rem' }} />
            <Typography variant='body1'>
              If you delete this project, your API keys will no longer work. This cannot be undone.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Checkbox
                checked={consentToDelete}
                onChange={e => setConsentToDelete(e.target.checked)}
                color='primary'
                sx={{ marginRight: '0.5rem' }}
              />
              <Typography variant='body1'>I already know all the consequences.</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button color='error' startIcon={<DeleteIcon />} onClick={handleConfirmDelete} disabled={!consentToDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  )
}

export default projectDetails

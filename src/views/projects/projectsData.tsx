// ** React Imports
import { Ref, useState, forwardRef, ReactElement, MouseEvent, Fragment } from 'react'
import { useAuth } from 'src/hooks/useAuth'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Avatar from 'src/@core/components/mui/avatar'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined'

import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import { Divider } from '@mui/material'

interface Project {
  apiSecret: string
  projectId: string
  apiKey: string
  userId: string
  updatedAt: string
  createdAt: string
  uuid: string
  projectName: string
}

const ProjectData: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Card sx={{ width: '13rem', minHeight: '15rem', height: 'auto' }}>
      <CardContent
        sx={{
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          '& > :not(style) + :not(style)': {
            mt: 3 // Add spacing between items
          }
        }}
      >
        <Avatar variant='rounded' sx={{ width: '8rem', height: '6rem', fontSize: '3rem' }}>
          {project.projectName.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant='body1'>{project.projectName}</Typography>

        <Divider sx={{ width: '80%' }} />
        <Button variant='contained'>Get Started</Button>
      </CardContent>
    </Card>
  )
}

export default ProjectData

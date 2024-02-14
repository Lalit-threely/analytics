// ** MUI Import
import Grid from '@mui/material/Grid'
// ** Demo Component Imports

// ** Custom Component Import
import { ChangeEvent, useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AddProject from 'src/views/projects/addProject'
import ProjectData from 'src/views/projects/projectsData'
import { CircularProgress } from '@mui/material'

const AddProjects = () => {
  const [projectData, setProjectData] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [refreshKey, setRefreshKey] = useState(false)

  const auth = useAuth()

  const fetchData = async () => {
    setLoading(true)

    try {
      const data = await auth.getProjectsData({})
      debugger
      setProjectData(data.response)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey(prevKey => !prevKey)
  }

  return (
    <>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' minHeight='2vh'>
        <Typography
          variant='h2'
          component='div'
          gutterBottom
          style={{ padding: '15px', borderRadius: '20px', marginBottom: '20px' }}
        >
          All Projects
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item md={3} sm={4} xs={12}>
          <AddProject onRefresh={handleRefresh} />
        </Grid>
        {/* <Grid item md={3} sm={4} xs={12}>
          <ProjectData onRefresh={handleRefresh} />
        </Grid> */}

        {loading ? (
          <Grid item md={3} sm={4} xs={12}>
            <Box display='flex' justifyContent='center' alignItems='center' minHeight='50vh'>
              <CircularProgress />
            </Box>
          </Grid>
        ) : (
          // Mapping over projectData to render ProjectData components
          projectData.map((project: any, index: any) => (
            <Grid key={index} item md={3} sm={4} xs={12}>
              <ProjectData
                project={project} // Pass down project data as props to ProjectData component
              />
            </Grid>
          ))
        )}
      </Grid>
    </>
  )
}

export default AddProjects

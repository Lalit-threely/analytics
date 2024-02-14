import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { projectData } from 'src/types/apps/projectTypes'

const projectDetails = () => {
  const router = useRouter()
  const { projectData } = router.query
  const project:projectData = projectData ? JSON.parse(projectData as string) : null
  console.log('project', project)
  const goBack = () => {
    router.back();
  };

  if (!project) return (<div>
  <Button onClick={goBack}>Go Back</Button>
  </div>)



//   useEffect(() => {
//     goBack(); // Call goBack function on component mount (page refresh)
//   }, []); // Empty dependency array to run the effect only once


  return (
    <div>
    <Button onClick={goBack}>Go Back</Button>
      <h1>{project.projectName}</h1>
    </div>
  )
}

export default projectDetails

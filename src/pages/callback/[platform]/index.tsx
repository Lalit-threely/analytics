// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'

import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

import { useRouter } from 'next/router'
import { CircularProgress, IconButton, InputAdornment } from '@mui/material'
import axios from 'axios'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()
  const auth = useAuth()
  const router = useRouter()

  const params = router.query

  useEffect(() => {
    const submitData = async () => {
      console.log('useEffect called', params)
      //  const { state, code, scope, authuser, prompt } =params;
      let isFirefox = false
      const searchParams = new URLSearchParams(location.search)
      const code = searchParams.get('code')
      const scope = searchParams.get('scope')
      const state = searchParams.get('state')
      const fromClientId = localStorage.getItem('clientId') || ''
      console.log('fromClientId')
      console.log('search_params', searchParams)
      console.log('state, code, scope, authuser, prompt', state, code, scope)

      if (code && scope) {
        const resp = await auth.AdminOauth({ code, scope })
        // window.close()
      }
    }
    try {
      submitData()
    } catch (err:any) {
      console.error(err)
      toast.error(err?.response?.data?.error || err?.response?.data?.message)
    }
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50rem'
      }}
    >
      <CircularProgress color='success' size={60} />
    </Box>
  )
}

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPassword.guestGuard = true

export default ForgotPassword

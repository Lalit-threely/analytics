// ** React Imports
import { useState, ReactNode, MouseEvent, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import axios from 'axios'

// ** Styled Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const schema = yup.object().shape({
  username: yup.string().required(),
  companyName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
  confirmPassword: yup.string().required()
})

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  const {
    control,
    setError,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** Vars
  const { skin } = settings

  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

  console.log('control', control)
  const Submit = async () => {
    try {
      console.log('clicked', getValues())
      const { username, email, companyName, password, confirmPassword } = getValues();
      if(password!==confirmPassword){
        toast.error("Passwords are not matching");
        return;
      }
      const res = await auth.handleSignUp({ username, email, companyName, password })
      toast.success(res?.message)
      router.push(`/verification?email=${email}&from=signup`)
    } catch (err: any) {
      console.log('errrr', err)
      toast.error(err?.response?.data?.error || err?.response?.data?.message)
    }
  }

  const socialLoginClicked=async(socialNetwork:string)=>{
    console.log("clicked")
    const call = await axios.get(
      `${auth.baseURL}/api/v1/auth/admin/oauth/${socialNetwork}?origin=${window?.origin}`
    );
    console.log("json", call?.data?.url);
    const redirect_url = call?.data?.url;
    // window.open(
    //   redirect_url,
    //   "_blank"
    // );
    window.open(redirect_url, '_self');
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <RegisterIllustration
            alt='register-illustration'
            src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src='https://svgshare.com/i/11sN.svg' alt='' height='40px' width='40px' /> Adventure starts here 🚀
              </Typography>
              {/* <Typography sx={{ color: 'text.secondary' }}>Make your app management easy and fun!</Typography> */}
            </Box>
            <form noValidate autoComplete='off'>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    //@ts-ignore
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label='Name'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='John'
                      variant='outlined'
                      error={Boolean(errors.username)}
                      {...(errors.username && { helperText: errors.username.message })}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='companyName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                     //@ts-ignore
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label='Company Name'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='Tria'
                      variant='outlined'
                      error={Boolean(errors.companyName)}
                      {...(errors.companyName && { helperText: errors.companyName.message })}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                     //@ts-ignore
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder=''
                      variant='outlined'
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                     //@ts-ignore
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v4-password'
                      error={Boolean(errors.password)}
                      {...(errors.password && { helperText: errors.password.message })}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Controller
                  name='confirmPassword'
                  control={control}
                  rules={{ required: "Confirm Password is required" }}
                  render={({ field: { value, onChange, onBlur } }) => (
                     //@ts-ignore
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Confirm Password'
                      onChange={onChange}
                      id='auth-login-v-password'
                      error={Boolean(errors.confirmPassword)}
                      {...(errors.confirmPassword && { helperText: errors.confirmPassword.message })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {/* <FormControlLabel
                  label='Remember Me'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                /> */}
                {/* <Typography component={LinkStyled} href='/' onClick={e => e.preventDefault()} sx={{ ml: 1 }}>
                  privacy policy & terms
                </Typography> */}
              </Box>
              <Button fullWidth onClick={Submit} variant='contained' sx={{ mb: 4 }}>
                Sign up
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>Already have an account?</Typography>
                <Typography component={LinkStyled} href='/login'>
                  Sign in instead
                </Typography>
              </Box>
              <Divider
                sx={{
                  color: 'text.disabled',
                  '& .MuiDivider-wrapper': { px: 6 },
                  fontSize: theme.typography.body2.fontSize,
                  my: theme => `${theme.spacing(6)} !important`
                }}
              >
                or
              </Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* <IconButton href='/' component={Link} sx={{ color: '#497ce2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:facebook' />
                </IconButton>
                <IconButton href='/' component={Link} sx={{ color: '#1da1f2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:twitter' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  onClick={e => e.preventDefault()}
                  sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                >
                  <Icon icon='mdi:github' />
                </IconButton> */}
                <Box  sx={{ color: '#db4437',cursor:'pointer' }} onClick={() =>socialLoginClicked('google')}>
                  <Icon icon='mdi:google' />
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register

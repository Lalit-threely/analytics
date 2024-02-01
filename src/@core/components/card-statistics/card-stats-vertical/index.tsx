// ** MUI Imports
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Type Import
import { CardStatsVerticalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Component Import
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Skeleton } from '@mui/material'

const CardStatsVertical = (props: CardStatsVerticalProps) => {
  // ** Props
  const {
    sx,
    stats,
    title,
    chipText,
    subtitle,
    avatarIcon,
    avatarSize = 44,
    iconSize = '1.75rem',
    chipColor = 'primary',
    avatarColor = 'primary',
    loading
  } = props

  const RenderChip = chipColor === 'default' ? Chip : CustomChip

  return (
    <Card sx={{ ...sx }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <CustomAvatar
          skin='light'
          variant='rounded'
          color={avatarColor}
          sx={{ mb: 3.5, width: avatarSize, height: avatarSize }}
        >
          <Icon icon={avatarIcon} fontSize={iconSize} />
        </CustomAvatar> */}
        <Typography variant='h5' sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant='body2' sx={{ mb: 1, color: 'text.disabled' }}>
          {subtitle}
        </Typography>
        <Typography sx={{ fontSize: '40px', mb: 3.5, color: 'text.secondary' }}>
          {loading ? <Skeleton variant='text' sx={{ fontSize: '1rem', width: '3rem', minHeight: '3.6rem' }} /> : stats}
        </Typography>

        {chipText && (
          <RenderChip
            size='small'
            label={chipText}
            color={chipColor}
            {...(chipColor === 'default'
              ? { sx: { borderRadius: '4px', color: 'text.secondary' } }
              : { rounded: true, skin: 'light' })}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical

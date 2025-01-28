import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import axios from 'axios' // You can use axios or fetch for API calls

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const AnalyticsWeeklyOverview = () => {
  // ** Hook
  const theme = useTheme()
  const [seriesData, setSeriesData] = useState([0, 0, 0, 0, 0, 0, 0])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken') // Adjust this key based on how you store the token

        const response = await axios.get('http://localhost:5000/stats/overview', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true // Important if you're using cookies
        })

        // Data is already in `response.data` with Axios
        const data = response.data
        console.log('--', data)

        // Créez un tableau pour stocker les messages par jour
        const daysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const messageCounts = daysOrder.map(day => {
          const dayData = data.find(d => d.day === day)
          return dayData ? dayData.total_messages : 0
        })

        setSeriesData(messageCounts)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      borderColor: theme.palette.divider,
      padding: {
        top: -1,
        left: -9,
        right: 0,
        bottom: 5
      }
    },
    dataLabels: { enabled: false },
    // colors: [
    //   theme.palette.customColors.trackBg,
    //   theme.palette.customColors.trackBg,
    //   theme.palette.customColors.trackBg,
    //   theme.palette.primary.main,
    //   theme.palette.customColors.trackBg,
    //   theme.palette.customColors.trackBg
    // ],
    colors: ['#1976D2'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // Correspond à daysOrder
      tickPlacement: 'on',
      labels: { show: true }, // Afficher les étiquettes des jours
      axisTicks: { show: true }, // Ajouter les tick marks
      axisBorder: { show: true } // Ajouter la bordure de l'axe x
    },

    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetY: 2,
        offsetX: -17,
        style: { colors: theme.palette.text.primary },
        formatter: value => `${value}` // Afficher directement les valeurs
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Weekly Overview'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <OptionsMenu
            options={['Refresh', 'Update', 'Delete']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.primary' } }}
          />
        }
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts type='bar' height={205} options={options} series={[{ data: seriesData }]} />
        <Box sx={{ mb: 7, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ mr: 4 }}>
            45%
          </Typography>
          <Typography variant='body2'>Your sales performance is 45% 😎 better compared to last month</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AnalyticsWeeklyOverview

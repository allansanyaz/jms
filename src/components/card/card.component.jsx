'use client';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import LanIcon from '@mui/icons-material/Lan';
import SpeedIcon from '@mui/icons-material/Speed';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';

const IconList = [
	<LanIcon key={1} color={'primary'} sx={{ fontSize: '2.5rem' }} />,
	<SpeedIcon key={2} color={'primary'} sx={{ fontSize: '2.5rem' }} />,
	<ComputerIcon key={3} color={'primary'} sx={{ fontSize: '2.5rem' }} />,
	<StorageIcon key={4} color={'primary'} sx={{ fontSize: '2.5rem' }} />
];

const CardComponent = ({ title, description, idx }) => {
	// Note that this should also read the information on the clusters and populate accordingly
	
	return (
		<Card sx={{
			width: '180px'
		}}>
			<CardContent sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				gap: '0.1rem',
			}}>
				{IconList[idx]}
				<Typography variant="subtitle1">
					{description}
				</Typography>
				<Typography
					variant="button"
		            gutterBottom
					sx={{
						fontWeight: 'bold',
					}}
				>
					{title}
				</Typography>
			</CardContent>
		</Card>
	)
}

export default CardComponent;
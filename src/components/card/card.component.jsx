import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import LanIcon from '@mui/icons-material/Lan';
import SpeedIcon from '@mui/icons-material/Speed';
import DnsIcon from '@mui/icons-material/Dns';
import StorageIcon from '@mui/icons-material/Storage';

const IconList = [LanIcon, SpeedIcon, DnsIcon, StorageIcon];

const CardComponent = ({ title, description, idx }) => {
	// Note that this should also read the information on the clusters and populate accordingly
	
	return (
		<Card>
			<CardContent>
				<Typography variant="h5" component="div">
					{title}
				</Typography>
				{IconList[idx]}
				<Typography variant="h5" component="div">
					{description}
				</Typography>
			</CardContent>
		</Card>
	)
}

export default CardComponent;
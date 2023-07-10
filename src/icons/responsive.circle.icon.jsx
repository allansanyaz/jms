'use client';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ResponsiveCircle = ({progress}) => {
	return (
		<Box sx={{ position: 'relative', display: 'inline-flex' }}>
			<CircularProgress
				variant="determinate"
				value={progress}
				size={'8rem'}
			/>
			<Box
				sx={{
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					position: 'absolute',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Typography
					variant="h5"
					component="div"
					color="text.secondary"
				>
					{`${Math.round(progress)}%`}
				</Typography>
			</Box>
		</Box>
		
	)
}

export default ResponsiveCircle;

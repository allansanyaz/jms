'use client';
import Box from '@mui/material/Box';
import ComputerIcon from '@mui/icons-material/Computer';
import { DataGrid } from '@mui/x-data-grid';
import Divider from '@mui/material/Divider';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { columns, rows } from './table.data.js';

const QueueComponent = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				border: '1px solid #B2BEB5',
				borderRadius: '0.5rem',
				boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
				minWidth: '20rem',
				maxWidth: '100%',
				padding: '1rem 0',
			}}
		>
			<Stack
				direction="row"
				spacing={1}
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
				}}
			>
				<ComputerIcon key={3} color={'primary'} sx={{ fontSize: '2.5rem' }} />
				<Typography
					variant="h5"
					gutterBottom
					sx={{
						fontWeight: 'bold',
						textTransform: 'uppercase',
					}}
				>
					Queue
				</Typography>
			</Stack>
			
			<Divider sx={{ my: 2 }} />
			
			<Stack
				direction="column"
				spacing={1}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					width: '100%',
				}}
			>
			</Stack>
			
		</Box>
	)
}

export default QueueComponent;

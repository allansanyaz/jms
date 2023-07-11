import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Divider from '@mui/material/Divider';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DeleteComponent from '@/components/queue/delete.component.jsx';
import ComputerIcon from '@mui/icons-material/Computer';
import WorkIcon from '@mui/icons-material/Work';
import BadgeIcon from '@mui/icons-material/Badge';
import QueueIcon from '@mui/icons-material/Queue';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LanIcon from '@mui/icons-material/Lan';
import MemoryIcon from '@mui/icons-material/Memory';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

import '@/styles/dashboard/dashboard.styles.css';

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
				boxSizing: 'border-dashboard',
				width: '100%',
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
			
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<DataGrid
					rows={rows}
					columns={columns}
					sx={{
						boxSizing: 'border-dashboard',
						width: '100%',
						height: 400,
					}}
					slots={{
						toolbar: GridToolbar,
					}}
				>
				
				</DataGrid>
			</Box>
			
		</Box>
	)
}

export default QueueComponent;

export const rows = [
	{ id: 1, jobID: 'JID_123456', queue: 'batch', jobName: 'job1', state: 'R', nodes: 4, cores: 48, walltime: '06:00:00', delete: '' },
	{ id: 2, jobID: 'JID_123457', queue: 'batch', jobName: 'job2', state: 'R', nodes: 2, cores: 32, walltime: '12:00:00', delete: '' },
	{ id: 3, jobID: 'JID_123458', queue: 'batch', jobName: 'job3', state: 'R', nodes: 1, cores: 12, walltime: '08:00:00', delete: '' },
];
export const columns = [
	{
		field: 'id',
		headerName: 'ID',
		width: 85,
		headerClassName: 'queue-header'
	},
	{
		field: 'jobID',
		headerName: 'Job ID',
		description: 'Job ID',
		width: 150,
		headerClassName: 'queue-header',
		resizable: true,
	},
	{
		field: 'jobName',
		headerName: 'Job Name',
		description: 'Job Name',
		width: 150,
		headerClassName: 'queue-header',
		resizable: true,
	},
	{
		field: 'queue',
		headerName: 'Queue',
		description: 'Queue',
		width: 120,
		headerClassName: 'queue-header'
	},
	{
		field: 'state',
		headerName: 'State',
		description: 'State',
		headerClassName: 'queue-header',
		width: 120
	},
	{
		field: 'nodes',
		headerName: 'Nodes',
		description: 'Nodes',
		width: 115,
		headerClassName: 'queue-header',
	},
	{
		field: 'cores',
		headerName: 'Cores',
		description: 'Cores',
		width: 115,
		headerClassName: 'queue-header',
		align: 'center',
	},
	{
		field: 'walltime',
		headerName: 'Wall Time',
		description: 'Wall Time',
		width: 150,
		headerClassName: 'queue-header',
		align: 'center',
	},
	{
		field: 'delete',
		headerName: 'Delete',
		description: 'Delete',
		width: 120,
		headerClassName: 'queue-header',
		align: 'center',
		headerAlign: 'center',
		renderCell: (params) => (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
				}}
			>
				<DeleteComponent />
			</Box>
		)
	}
];

'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Divider from '@mui/material/Divider';
import Typography from "@mui/material/Typography";
import { CustomTypography } from '@/styles/typography/typography.styles';
import Stack from "@mui/material/Stack";
import DeleteComponent from '@/components/queue/delete.component.jsx';
import ComputerIcon from '@mui/icons-material/Computer';
import SettingsIcon from '@mui/icons-material/Settings';
import LanIcon from '@mui/icons-material/Lan';
import MemoryIcon from '@mui/icons-material/Memory';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import '@/styles/dashboard/dashboard.styles.css';

const QueueComponent = ({ rowData }) => {
	
	const [rows, setRows] = useState(null);
	
	const columns = [
		{
			field: 'jobID',
			headerName: 'Job ID',
			description: 'Job ID',
			width: 120,
			headerClassName: 'queue-header',
		},
		{
			field: 'username',
			headerName: 'Username',
			description: 'Username',
			width: 120,
			headerClassName: 'queue-header',
		},
		{
			field: 'queue',
			headerName: 'Queue',
			description: 'Queue',
			width: 120,
			headerClassName: 'queue-header'
		},
		{
			field: 'jobName',
			headerName: 'Job Name',
			description: 'Job Name',
			width: 120,
			headerClassName: 'queue-header',
		},
		{
			field: 'state',
			headerName: 'State',
			description: 'State',
			headerClassName: 'queue-header',
			width: 100,
		},
		{
			field: 'nodes',
			headerName: 'Nodes',
			description: 'Nodes',
			width: 90,
			headerClassName: 'queue-header',
			renderHeader: (params) => (
				<Box
					display="flex"
					flexDirection="row"
					justifyContent="center"
					width="100%"
				>
					<Tooltip title="Nodes">
						<LanIcon color={'primary'} sx={{ fontSize: '1.5rem' }}  />
					</Tooltip>
				</Box>
			)
		},
		{
			field: 'cores',
			headerName: 'Cores',
			description: 'Cores',
			width: 90,
			headerClassName: 'queue-header',
			renderHeader: (params) => (
				<Box
					display="flex"
					flexDirection="row"
				>
					<Tooltip title="Cores">
						<MemoryIcon color={'primary'} sx={{ fontSize: '1.5rem' }}  />
					</Tooltip>
				</Box>
			)
		},
		{
			field: 'walltime',
			headerName: 'Wall Time',
			description: 'Wall Time',
			width: 110,
			headerClassName: 'queue-header',
			renderHeader: (params) => (
				<Box
					display="flex"
					flexDirection="row"
				>
					<Tooltip title="Walltime">
						<HourglassTopIcon color={'primary'} sx={{ fontSize: '1.5rem' }}  />
					</Tooltip>
				</Box>
			)
		},
		{
			field: 'delete',
			headerName: 'Delete',
			description: 'Delete',
			width: 100,
			headerClassName: 'queue-header',
			renderCell: (params) => (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
					}}
				>
					<DeleteComponent
						rows={rows}
						setRows={setRows}
						dataID={params.id}
					/>
				</Box>
			),
			renderHeader: (params) => (
				<Box
					display="flex"
					flexDirection="row"
				>
					<Tooltip title="Options">
						<SettingsIcon color={'primary'} sx={{ fontSize: '1.5rem' }}  />
					</Tooltip>
				</Box>
			)
		}
	];

	useEffect(() => {
		if(rowData !== null || rowData !== undefined) {
			const data = initialiseRowData(rowData);
			setRows(data);
		}

	}, [rowData]);

	const initialiseRowData = () => {
		let data = [];
		let counter = 1;
		if (rows) {
			rows.forEach((row, idx) => {
				data.push({
					id: counter,
					jobID: rows[0],
					username: rows[1],
					queue: rows[2],
					jobName: rows[3],
					state: rows[4],
					nodes: rows[5],
					cores: rows[6],
					walltime: rows[7],
				});
				console.log(counter);
				counter++;
			});
		}
		return data;
	}
	
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
				maxWidth: '940px',
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
					minHeight: '400px',
				}}
			>
				{
					(rows === null) ?
					(
						<Box 
							sx={{ 
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<CircularProgress />
								<CustomTypography
									variant="body2"
									sx={{
										textTransform: 'capitalize',
										width: '100%',
										textAlign: 'center',
									}}
								>
									Loading...
								</CustomTypography>.
						</Box>
					) :
					(
						<DataGrid
							rows={rows}
							columns={columns}
							sx={{
								width: '100%',
								height: 400,
							}}
							slots={{
								toolbar: GridToolbar,
							}}
						>
						
						</DataGrid>
					)
				}
			</Box>
			
		</Box>
	)
}

export default QueueComponent;

const rowDataDemo = [
	{ id: 1, username: 'some user', jobID: 'JID_123456', queue: 'batch', jobName: 'job1', state: 'R', nodes: 4, cores: 48, walltime: '06:00:00', delete: '' },
	{ id: 2, username: '12345', jobID: 'JID_123457', queue: 'batch', jobName: 'job2', state: 'R', nodes: 2, cores: 32, walltime: '12:00:00', delete: '' },
	{ id: 3, username: '12345', jobID: 'JID_123458', queue: 'batch', jobName: 'job3', state: 'R', nodes: 1, cores: 12, walltime: '08:00:00', delete: '' },
];
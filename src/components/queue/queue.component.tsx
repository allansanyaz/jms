'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, gridColumnsTotalWidthSelector } from '@mui/x-data-grid';
import Divider from '@mui/material/Divider';
import Typography from "@mui/material/Typography";
import { CustomTypography } from '@/styles/typography/typography.styles';
import Stack from "@mui/material/Stack";
import DeleteComponent from '@/components/queue/delete.component';
import ComputerIcon from '@mui/icons-material/Computer';
import SettingsIcon from '@mui/icons-material/Settings';
import LanIcon from '@mui/icons-material/Lan';
import MemoryIcon from '@mui/icons-material/Memory';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { IQueueComponentResponseProps, IQueueComponentDataProps } from '@/lib/types/definitions';

import '@/styles/dashboard/dashboard.styles.css';

const QueueComponent = ({ rowData }: { rowData: IQueueComponentResponseProps[] }) => {
	const [rows, setRows] = useState<IQueueComponentDataProps[]>([]);
	
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
			renderHeader: (params: any) => (
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
			renderHeader: (params: any) => (
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
			renderHeader: (params: any) => (
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
			renderCell: (params: any) => (
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
			renderHeader: (params: any) => (
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

	const initialiseRowData = (rowsData: IQueueComponentResponseProps[]) => {
		let data: IQueueComponentDataProps[] = [];

		if(rowsData) {
			rowsData.forEach((row, idx) => {
				data.push({
					id: idx+1,
					jobID: row.job_id,
					username: row.values[0],
					queue: row.values[1],
					jobName: row.values[2],
					state: row.values[3],
					nodes: row.values[4],
					cores: row.values[5],
					walltime: row.values[7],
				});
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
							</CustomTypography>
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
							getRowHeight={() => 'auto'}
							slots={{
								toolbar: GridToolbar,
							}}
						/>
					)
				}
			</Box>
			
		</Box>
	)
}

export default QueueComponent;
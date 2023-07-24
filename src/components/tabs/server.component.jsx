'use client';
import * as React from 'react';
import { CustomStack } from '@/styles/layout/layout.styles.jsx';
import { CustomTypography } from '@/styles/typography/typography.styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button, DeleteButtonTrash, EditButton, AddButton } from '@/styles/buttons/button.styles.jsx';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';

const ServerComponent = () => {
	return (
		<CustomStack
			direction={'column'}
			sx={{
				border: '2px solid #B2BEB5',
				padding: '1rem',
				borderRadius: '4px',
				boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
			}}
		>
			<CustomTypography variant={'body2'} sx={{ fontWeight: '600', paddingBottom: '1rem' }} >
				PBS Server:
			</CustomTypography>
			
			<Box
				component="div"
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2, 1fr)',
					gap: '1rem',
				}}
				noValidate
				autoComplete="off"
			>
				<TextField
					id="server-name"
					label="Server name"
					variant="outlined"
				/>
				<TextField
					id="queue-name"
					label="Queue name"
					variant="outlined"
				/>
				<TextField
					id="scheduler-iteration"
					label="Scheduler Iteration"
					variant="outlined"
					type={'number'}
					defaultValue={600}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				<TextField
					id="node-check-rate"
					label="Node Check Rate (ms)"
					variant="outlined"
					type={'number'}
					defaultValue={150}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				<TextField
					id="tcp-timeout"
					label="TCP Timeout (ms)"
					variant="outlined"
					type={'number'}
					defaultValue={6}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				<TextField
					id="job-stat-rate"
					label="Job Stat Rate (ms)"
					variant="outlined"
					type={'number'}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				<TextField
					id="keep-completed-time"
					label="Keep Completed Time (s)"
					variant="outlined"
					type={'number'}
					defaultValue={300}
					InputProps={{ inputProps: { min: 0 } }}
				/>
			</Box>
			
			<FormGroup>
				<FormControlLabel control={<Checkbox defaultChecked />} label="Scheduling" />
				<FormControlLabel control={<Checkbox defaultChecked />} label="Sync server with MOM jobs?" />
				<FormControlLabel control={<Checkbox defaultChecked />} label=" View other users' jobs in queue?" />
				<FormControlLabel control={<Checkbox />} label="Moab array compatible?" />
			</FormGroup>
			
			<Button variant={'contained'} sx={{ width: '200px', marginTop: '1rem', alignSelf: 'flex-end' }}>
				<SaveIcon color={'white'} sx={{ fontSize: '1.5rem', marginRight: '0.5rem' }} /> Save Changes
			</Button>
			
			<CustomTypography variant={'body2'} sx={{ fontWeight: '600', paddingTop: '1.5rem', paddingBottom: '1rem' }} >
				Administrators:
			</CustomTypography>
			
			<TextField
				id="server-adminstrators"
				label="Server Administrators"
				variant="outlined"
				multiline
				rows={4}
			/>
			<CustomStack
				direction={'row'}
				sx={{
					justifyContent: 'flex-end',
				}}
			>
				<Tooltip title="Add" placement="top">
					<AddButton sx={{ fontSize: '2.0rem', color: 'green' }} />
				</Tooltip>
				<Tooltip title="Edit" placement="top">
					<EditButton sx={{ fontSize: '1.8rem', color: 'orange' }} />
				</Tooltip>
				<Tooltip title="Delete" placement="top">
					<DeleteButtonTrash sx={{ fontSize: '1.9rem', color: 'red' }} />
				</Tooltip>
			</CustomStack>
			
		</CustomStack>
	)
}

export default ServerComponent;

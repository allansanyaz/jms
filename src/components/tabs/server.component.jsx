'use client';
import * as React from 'react';
import { CustomStack } from '@/styles/layout/layout.styles.jsx';
import { CustomTypography } from '@/styles/typography/typography.styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@/styles/buttons/button.styles.jsx';

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
				<TextField id="server-name" label="Server name" variant="outlined" />
				<TextField id="queue-name" label="Queue name" variant="outlined" />
				<TextField id="scheduler-iteration" label="Scheduler Iteration" variant="outlined" type={'number'} defaultValue={600} />
				<TextField id="node-check-rate" label="Node Check Rate (ms)" variant="outlined" type={'number'} defaultValue={150} />
				<TextField id="tcp-timeout" label="TCP Timeout (ms)" variant="outlined" type={'number'} defaultValue={6} />
				<TextField id="job-stat-rate" label="Job Stat Rate (ms)" variant="outlined" type={'number'} />
				<TextField id="keep-completed-time" label="Keep Completed Time (s)" variant="outlined" type={'number'} defaultValue={300} />
			</Box>
			
			<FormGroup
			
			>
				<FormControlLabel control={<Checkbox defaultChecked />} label="Scheduling" />
				<FormControlLabel control={<Checkbox defaultChecked />} label="Sync server with MOM jobs?" />
				<FormControlLabel control={<Checkbox defaultChecked />} label=" View other users' jobs in queue?" />
				<FormControlLabel control={<Checkbox />} label="Moab array compatible?" />
			</FormGroup>
			
			<Button variant={'contained'} sx={{ width: '120px', marginTop: '1rem' }}>Save</Button>
			
			<CustomTypography variant={'body2'} sx={{ fontWeight: '600', paddingBottom: '1rem' }} >
				Administrators:
			</CustomTypography>
			
			<TextField
				id="server-adminstrators"
				label="Server name"
				variant="outlined"
				multiline
				rows={4}
			/>
			
		</CustomStack>
	)
}

export default ServerComponent;

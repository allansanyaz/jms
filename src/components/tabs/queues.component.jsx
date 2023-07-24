'use client';
import * as React from "react";
import { useState } from "react";
import { CustomDivider, CustomStack } from '@/styles/layout/layout.styles.jsx';
import { CustomTypography } from "@/styles/typography/typography.styles";
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from "@mui/material/Checkbox";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from "@mui/material/TextField";
import { Button } from "@/styles/buttons/button.styles.jsx";
import SaveIcon from '@mui/icons-material/Save';

const QueueComponent = () => {
	
	const [queue, setQueue] = useState(queues[0]);
	
	const onQueueChange = (event, newQueue) => {
		setQueue(newQueue);
	}
	
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
				Queues:
			</CustomTypography>
			
			<ToggleButtonGroup
				value={queue}
				exclusive
				onChange={onQueueChange}
				aria-label="Cluster queues"
			>
				{
					queues.map((queue, index) => (
						<ToggleButton key={index} value={queue} aria-label={queue}>
							{queue}
						</ToggleButton>
					))
				}
			</ToggleButtonGroup>
			
			<CustomDivider sx={{ my: 1 }} />
			
			<CustomTypography variant={'button'} sx={{ fontWeight: '600', paddingTop: '1rem' }} >
				General:
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
				
				<FormControlLabel control={<Checkbox defaultChecked />} label="Enabled" />
				<FormControlLabel control={<Checkbox defaultChecked />} label="Started" />
				
				<TextField
					id="queue-type"
					label="Queue Type"
					variant="outlined"
					defaultValue={'Execution'}
				/>
				
				<TextField
					id="max-jobs-queueable"
					label="Max jobs queueable at a time"
					variant="outlined"
					type={'number'}
					defaultValue={100}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				
				<TextField
					id="max-jobs-running"
					label="Max jobs running at a time"
					variant="outlined"
					type={'number'}
					defaultValue={40}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				
			</Box>
			
			<CustomDivider sx={{ my: 1 }} />
			
			<CustomTypography variant={'button'} sx={{ fontWeight: '600', paddingBottom: '1rem' }} >
				User Settings:
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
					id="max-jobs-queueable-user"
					label="Max jobs queueable per user"
					variant="outlined"
					type={'number'}
					defaultValue={40}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				
				<TextField
					id="max-jobs-running-user"
					label="Max jobs running per user"
					variant="outlined"
					type={'number'}
					defaultValue={10}
					InputProps={{ inputProps: { min: 0 } }}
				/>
			</Box>
			
			<CustomDivider sx={{ my: 1 }} />
			
			<CustomTypography variant={'button'} sx={{ fontWeight: '600', paddingBottom: '1rem' }} >
				Resources:
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
					id="max-memory"
					label="Max memory"
					variant="outlined"
					defaultValue={'16gb'}
				/>
				
				<TextField
					id="max-cores"
					label="Max cores"
					variant="outlined"
					type={'number'}
					defaultValue={1}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				
				<TextField
					id="max-nodes"
					label="Max nodes"
					variant="outlined"
					type={'number'}
					defaultValue={1}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				
				<TextField
					id="max-walltime"
					label="Max walltime"
					variant="outlined"
					defaultValue={'72:00:00'}
				/>
				
				<TextField
					id="default-memory"
					label="Default memory"
					variant="outlined"
					defaultValue={'1gb'}
				/>
				
				<TextField
					id="default-cores"
					label="Default cores"
					variant="outlined"
					type={'number'}
					defaultValue={1}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				
				<TextField
					id="default-nodes"
					label="Default nodes"
					variant="outlined"
					type={'number'}
					defaultValue={1}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				
				<TextField
					id="default-walltime"
					label="Default walltime"
					variant="outlined"
					defaultValue={'01:00:00'}
				/>
			</Box>
			
			<CustomDivider sx={{ my: 1 }} />
			
			<CustomTypography variant={'button'} sx={{ fontWeight: '600', paddingBottom: '1rem' }} >
				Access Control:
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
				<FormControlLabel control={<Checkbox />} label="Enable group-based access control" />
				<FormControlLabel control={<Checkbox />} label="Enable user based access control" />
				
				<TextField
					id="group-access"
					label="Groups with access"
					variant="outlined"
				/>
				
				<TextField
					id="user-access"
					label="Users with access"
					variant="outlined"
				/>
			</Box>
			
			<Button variant={'contained'} sx={{ width: '200px', marginTop: '1rem', alignSelf: 'flex-end'}}>
				<SaveIcon color={'white'} sx={{ fontSize: '1.5rem', marginRight: '0.5rem' }} /> Save Changes
			</Button>
			
		</CustomStack>
	)
}

export default QueueComponent;

const queues = ["Throughput", "Batch", "Power"];

'use client';
import * as React from "react";
import { useState } from "react";
import { CustomDivider, CustomStack } from '@/styles/layout/layout.styles.jsx';
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import { Button } from "@/styles/buttons/button.styles.jsx";
import { CustomTypography } from "@/styles/typography/typography.styles";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CustomJobsComponent = () => {
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
			<Button variant={'contained'} sx={{ width: '120px', marginTop: '1rem',  alignSelf: 'flex-end' }}>
				<ArrowBackIcon color={'white'} sx={{ fontSize: '1.5rem', marginRight: '0.5rem' }} /> Back
			</Button>
			
			<CustomDivider sx={{ my: 1 }} />
			
			<CustomTypography variant={'body2'} sx={{ fontWeight: '600', paddingBottom: '1rem' }} >
				Job Details:
			</CustomTypography>
			
			<CustomStack
				direction={'column'}
				spacing={2}
			>
				
				<TextField
					id="custom-job-name"
					label="Job Name"
					variant="outlined"
					helperText="Enter a name for your job"
				/>
				
				<TextField
					id="custom-job-description"
					label="Description"
					variant="outlined"
					multiline
					rows={4}
					helperText="Enter a description for your job"
				/>
				
				<CustomDivider sx={{ my: 1 }} />
				
				<CustomTypography variant={'body2'} sx={{ fontWeight: '600'}} >
					Settings:
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
						id="custom-nodes"
						label="Nodes"
						variant="outlined"
						type={'number'}
						defaultValue={1}
					/>
					
					<TextField
						id="custom-cores"
						label="Cores"
						variant="outlined"
						type={'number'}
						defaultValue={1}
					/>
					
					<TextField
						id="custom-memory"
						label="Memory (GB)"
						variant="outlined"
						type={'number'}
						defaultValue={1}
					/>
					
					<TextField
						id="custom-walltime"
						label="Walltime (hh:mm:ss)"
						variant="outlined"
						defaultValue={'01:00:00'}
					/>
					
					<TextField
						id="custom-queue"
						label="Queue"
						variant="outlined"
						defaultValue={'batch'}
					/>
					
					<TextField
						id="custom-environmental-variables"
						label="Environmental Variables"
						variant="outlined"
					/>
					
				</Box>
				
				<CustomDivider sx={{ my: 1 }} />
				
				<CustomTypography variant={'body2'} sx={{ fontWeight: '600' }} >
					Scripts:
				</CustomTypography>
				
				<TextField
					id="custom-scripts"
					label="Enter your commands"
					variant="outlined"
					multiline
					rows={4}
				/>
				
				<TextField
					id="custom-scripts-upload"
					label="Enter your commands"
					variant="outlined"
					helperText="Upload your scripts/files"
				/>
				
			</CustomStack>
			
			<Button variant={'contained'} sx={{ width: '200px', marginTop: '1rem', alignSelf: 'flex-end' }}>
				<PlayArrowIcon color={'white'} sx={{ fontSize: '1.5rem', marginRight: '0.5rem' }} /> Run Job
			</Button>
			
		</CustomStack>
	)
}

export default CustomJobsComponent;

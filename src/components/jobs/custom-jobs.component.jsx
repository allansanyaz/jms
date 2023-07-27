'use client';
import * as React from "react";
import { useState, useRef } from "react";
import { CustomDivider, CustomStack } from '@/styles/layout/layout.styles.jsx';
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import { Button } from "@/styles/buttons/button.styles.jsx";
import { CustomTypography } from "@/styles/typography/typography.styles";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Link from 'next/link';

const CustomJobsComponent = () => {
	
	const hiddenFileInput = useRef(null);
	const [fileName, setFileName] = useState('');
	const [scriptContent, setScriptContent] = useState('');
	
	const handleChange = (event) => {
		if(!event.target.files) return;
		// upload the script file to the server
		// set the target sequence to the file
		const loadedFile = event.target.files[0];
		const scriptReader = new FileReader();
		scriptReader.onload = () => {
			const fileContent = scriptReader.result;
			setScriptContent(fileContent);
			console.log(fileContent);
		}
		scriptReader.readAsText(loadedFile);
		setFileName(loadedFile.name);
	}
	
	const handleUploadClick = () => {
		hiddenFileInput.current.click();
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
			<Link className={'customlink'} href={'/tools/'} style={{width: '120px', marginTop: '1rem',  alignSelf: 'flex-end' }} >
				<Button variant={'contained'}>
					<ArrowBackIcon sx={{ fontSize: '1.5rem', marginRight: '0.5rem', color: 'white' }} /> Back
				</Button>
			</Link>
			
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
				
				<input
					type={'file'}
					ref={hiddenFileInput}
					onChange={handleChange}
					style={{ display: 'none' }}
				/>
				
				<Button onClick={handleUploadClick} variant={'contained'} sx={{ width: '200px', marginTop: '1rem', alignSelf: 'flex-start' }}
				>
					<FileUploadIcon sx={{ fontSize: '1.5rem', marginRight: '0.5rem', color: 'white' }} />
					{fileName ? fileName : 'Upload Script'}
				</Button>
				
				
			</CustomStack>
			
			<Button variant={'contained'} sx={{ width: '200px', marginTop: '1rem', alignSelf: 'flex-end' }}>
				<PlayArrowIcon sx={{ fontSize: '1.5rem', marginRight: '0.5rem', color: 'white' }} /> Run Job
			</Button>
			
		</CustomStack>
	)
}

export default CustomJobsComponent;

'use client';
import { useState, useEffect } from 'react';
import { HistoryToggleOffIconComponent } from "@/styles/tools/tools.styles";
import { CustomDivider, CustomStack } from "@/styles/layout/layout.styles";
import { CustomTypography } from "@/styles/typography/typography.styles";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const JobHistoryComponent = () => {

	// get the jobs history
	const [rows, setRows] = useState(null);
	const [jobData, setJobData] = useState(null);

	useEffect(() => {
		axios.get('/api/jms/jobs')
			.then((response) => response.data)
			.then((data) => {
				//initialise the data
				const rowData = initialiseRowData(data);
				setRows(rowData);
			})
			.catch((error) => {
				console.log(error)
			});
	}, []);

	const initialiseRowData = (jobHistory) => {
		let data = [];
		let rawData = {}
		let counter = 1;

		console.log(jobHistory)

		if(jobHistory) {
			jobHistory.forEach((job) => {
				data.push({
					id: counter,
					jobID: job.JobID,
					name: job.JobName,
					description: job.JobDescription,
					toolVersion: (job.ToolVersion) ? job.ToolVersion: "External Job",
					timeSubmitted: job.SubmittedAt,
				});
				rawData[job.JobID] = job;
				counter++;
			});
		}

		// set the raw data object
		setJobData(rawData);

		return data;
	}

	console.log(jobData);

	return (
		<CustomStack
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				flexWrap: 'wrap',
				gap: '1rem',
				padding: '0 12px 12px 12px',
				border: '2px solid #B2BEB5',
				borderRadius: '4px',
				boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
			}}
		>
			<CustomStack
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: '1rem',
					paddingTop: '1rem',
				}}
			>
				<HistoryToggleOffIconComponent color={'primary'} sx={{ fontSize: '2.5rem' }} />
				<CustomTypography
					variant={'h3'}
					sx={{
						textTransform: 'uppercase',
						fontWeight: '500',
					}}
				>
					Job History
				</CustomTypography>
			</CustomStack>
			
			<CustomDivider sx={{ my: 0 }} />
			
			<CustomStack
				direction={'column'}
				sx={{
					border: '2px solid #B2BEB5',
					padding: '1rem',
					borderRadius: '4px',
					boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						width: '100%',
					}}
				>
					{
						(!rows) ?
						(
							<>
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
							</>
						):
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
			</CustomStack>
			
		</CustomStack>
	)
}

export default JobHistoryComponent;

const columns = [
	{
		field: 'jobID',
		headerName: 'Job ID',
		width: 150,
		headerClassName: 'queue-header'
	},
	{
		field: 'name',
		headerName: 'Name',
		width: 150,
		headerClassName: 'queue-header'
	},
	{
		field: 'description',
		headerName: 'Description',
		width: 350,
		headerClassName: 'queue-header'
	},
	{
		field: 'toolVersion',
		headerName: 'Tool Version',
		width: 150,
		headerClassName: 'queue-header'
	},
	{
		field: 'timeSubmitted',
		headerName: 'Time Submitted',
		width: 200,
		headerClassName: 'queue-header'
	}
]
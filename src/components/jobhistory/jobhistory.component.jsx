'use client';
import { useState, useEffect } from 'react';
import { HistoryToggleOffIconComponent } from "@/styles/tools/tools.styles";
import { CustomDivider, CustomStack } from "@/styles/layout/layout.styles";
import { CustomTypography } from "@/styles/typography/typography.styles";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const JobHistoryComponent = () => {
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
				</Box>
			</CustomStack>
			
		</CustomStack>
	)
}

export default JobHistoryComponent;

const columns = [
	{
		field: 'id',
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
		width: 250,
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

const rows = [
	{ id: 1, name: 'Job 1', description: 'Job 1 Description', toolVersion: 'Tool 1', timeSubmitted: '2021-10-01 12:00:00' },
	{ id: 2, name: 'Job 2', description: 'Job 2 Description', toolVersion: 'Tool 2', timeSubmitted: '2021-10-02 12:00:00' },
	{ id: 3, name: 'Job 3', description: 'Job 3 Description', toolVersion: 'Tool 3', timeSubmitted: '2021-10-03 12:00:00' },
]
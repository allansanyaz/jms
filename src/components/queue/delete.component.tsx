'use client';
import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import { CustomStack } from '@/styles/layout/layout.styles';
import { CustomTypography } from '@/styles/typography/typography.styles';
import { Button, DeleteButtonTrash } from "@/styles/buttons/button.styles";
import Tooltip from '@mui/material/Tooltip';
import { IQueueComponentDataProps } from '@/lib/types/definitions';

interface IDeleteComponentProps {
	rows: IQueueComponentDataProps[];
	setRows: React.Dispatch<React.SetStateAction<IQueueComponentDataProps[]>>;
	dataID: number;
}

const DeleteComponent = ({ rows, setRows, dataID }: IDeleteComponentProps) => {
	
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	
	const openPopover = (event: React.MouseEvent<SVGSVGElement | HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget as HTMLButtonElement);
	};
	
	const closePopover = () => {
		setAnchorEl(null);
	}
	
	const deleteRow = (id: number) => {
		// filter through the rows and take what is not the id
		const newRowData = rows.filter((row) => row.id !== id);
		// set the new row data
		setRows(newRowData);
		// this will also need to be changed on the cluster side
	}
	
	const open = Boolean(anchorEl);
	const id = open ? 'delete-popover' : undefined;
	
	return (
		<>
			<Tooltip title="Delete">
				<DeleteButtonTrash
					onClick={openPopover}
					color={'primary'}
					sx={{ fontSize: '1.5rem' }}
				/>
			</Tooltip>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={closePopover}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					maxWidth: '320px',
				}}
			>
				<CustomStack
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '1rem',
						padding: '1rem',
					}}
				>
					<CustomTypography variant="body2" gutterBottom>
						Are you sure you want to delete this job?
					</CustomTypography>
					
					<CustomStack
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							gap: '1rem',
						}}
					>
						<Button
							backgroundColor={'#f44336'}
							onClick={() => deleteRow(dataID)}
						>
							Yes
						</Button>
						<Button
							backgroundColor={'#3f51b5'}
							onClick={closePopover}
						>
							No
						</Button>
					
					</CustomStack>
					
				</CustomStack>
			
			</Popover>
		</>

		
	)
};

export default DeleteComponent;

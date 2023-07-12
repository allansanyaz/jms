'use client';
import { useState } from 'react';
import Popover from '@mui/material/Popover';
import CustomTypography from '@/styles/typography/typography.styles';
import { DeleteButtonTrash } from "@/styles/buttons/button.styles";

const DeleteComponent = ({ rows, setRows, dataID }) => {
	
	const [anchorEl, setAnchorEl] = useState(null);
	
	const openPopover = (event) => {
		setAnchorEl(event.currentTarget);
	};
	
	const onDeleteClick = (id) => {
		// filter through the rows and take what is not the id
		const newRowData = rows.filter((row) => row.id !== id);
		// set the new row data
		setRows(newRowData);
		// this will also need to be changed on the cluster side
	}
	
	return (
		<>
			<DeleteButtonTrash
				onClick={openPopover}
				color={'primary'}
				sx={{ fontSize: '1.5rem' }}
			/>
			<Popover>
			
			</Popover>
		</>

		
	)
};

export default DeleteComponent;

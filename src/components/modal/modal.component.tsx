import * as React from 'react';
import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from "@mui/material/Box";
import { CustomStack } from '@/styles/layout/layout.styles';
import { CustomTypography } from '@/styles/typography/typography.styles';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@/styles/buttons/button.styles';

import './modal.styles.scss';

interface IModalComponentProps {
	openModal: boolean;
	setOpenModal: (open: boolean) => void;
	categories: string[];
}

const ModalComponent = ({ openModal, setOpenModal, categories }: IModalComponentProps) => {
	
	const [categoryButtonClicked, setCategoryButtonClicked] = useState(false);
	const [newCategory, setNewCategory] = useState('');
	
	const handleClose = () => {
		setOpenModal(false);
	}
	
	const showCategoryField = () => {
		setCategoryButtonClicked(true);
	}
	
	const hideCategoryField = () => {
		setCategoryButtonClicked(false);
	}
	
	const saveNewCategory = () => {
		categories.push(newCategory);
		setCategoryButtonClicked(false);
	}
	
	const finaliseNewTool = () => {
		// this is where we save the new tool
	}
	
	return (
		<Modal
			open={openModal}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style}>
				<TextField
					id="tool-name"
					label="Tool name"
					variant="outlined"
				/>
				
				<TextField
					id="tool-categories"
					label="Select Category"
					variant="outlined"
					select
					helperText="Please select a category"
					SelectProps={{
						native: true,
					}}
				>
					{
						categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))
					}
				</TextField>
				
				{
					!categoryButtonClicked ?
					(
						<CustomTypography
							className={'category_add'}
							variant={'body2'}
							sx={{fontWeight: '600'}}
							onClick={() => showCategoryField()}
						>
							<AddIcon sx={{fontSize: '1rem'}}/> Add New Category...
						</CustomTypography>
					) :
					(
						<CustomStack
							direction={'row'}
						>
							<TextField
								id="tool-name-new"
								label="Enter Tool Name"
								variant="outlined"
								onChange={(e) => setNewCategory(e.target.value)}
							/>
							<CustomStack
								direction={'row'}
							>
								<Tooltip title="Save" placement="top">
									<SaveIcon
										className={'category_add'}
										sx={{ fontSize: '2rem', color: 'green' }}
										onClick={() => saveNewCategory()}
									/>
								</Tooltip>
								<Tooltip title="Cancel" placement="top">
									<CloseIcon
										className={'category_add'}
										sx={{ fontSize: '2rem', color: 'red' }}
										onClick={() => hideCategoryField()}
									/>
								</Tooltip>
							</CustomStack>
						</CustomStack>
					)
				}
				
				<TextField
					id="tool-description"
					label="Description"
					variant="outlined"
					multiline
					rows={4}
				/>
				
				<CustomStack
					direction={'row'}
					spacing={2}
				>
					<Button
						backgroundColor={'green'}
					>
						Add Tool
					</Button>
					<Button
						backgroundColor={'red'}
						onClick={() => handleClose()}
					>
						Close
					</Button>
				</CustomStack>
				
			</Box>
		</Modal>
	)
}

export default ModalComponent;

const style = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	gap: '1rem',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

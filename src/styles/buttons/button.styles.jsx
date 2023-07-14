'use client';
import { styled } from '@mui/material/styles';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
export const Button = styled('button')((props) => ({
	color: 'white',
	backgroundColor: props.backgroundColor ? props.backgroundColor : '#3f51b5',
	fontWeight: 'bold',
	borderRadius: '4px',
	padding: '8px 16px',
	
	'&:hover': {
		backgroundColor: props.backgroundColor ? props.backgroundColor : '#3f51b5',
		boxShadow: props.hoverColor ? `0 0 0 0.2rem ${props.hoverColor}` : '0 0 0 0.2rem #3f51b550',
	}
}));

export const DeleteButtonTrash = styled(DeleteForeverIcon)({
	'&:hover': {
		cursor: 'pointer',
	},
});
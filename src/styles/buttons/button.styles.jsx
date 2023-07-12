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
		boxShadow: '0 0 0 0.2rem rgba(63,81,181,.5)',
	}
}));

export const DeleteButtonTrash = styled(DeleteForeverIcon)({
	'&:hover': {
		cursor: 'pointer',
	},
});
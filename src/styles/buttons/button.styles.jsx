import { styled } from '@mui/material/styles';

export const Button = styled('button')({
	color: 'white',
	backgroundColor: '#3f51b5',
	fontWeight: 'bold',
	borderRadius: '4px',
	padding: '8px 16px',
	
	'&:hover': {
		backgroundColor: '#303f9f',
		boxShadow: '0 0 0 0.2rem rgba(63,81,181,.5)',
	}
});
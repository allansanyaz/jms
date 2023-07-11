import { styled } from '@mui/material/styles';

export const Dashboard = styled('div')(props => ({
	backgroundColor: '#fff',
	display: 'grid',
	gridTemplateColumns: 'repeat(2, 1fr)',
	gap: '1rem',
	// add responsiveness to mobile
	'@media only screen and (max-width: 1280px)': {
		gridTemplateColumns: '300px 30rem'
	},
	'@media only screen and (max-width: 768px)': {
		gridTemplateColumns: '360px'
	}
}));
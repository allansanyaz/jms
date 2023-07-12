'use client';
import { styled } from '@mui/material/styles';

export const Dashboard = styled('div')(props => ({
	backgroundColor: '#fff',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	gap: '1rem',
	// add responsiveness to mobile
	'@media only screen and (max-width: 1280px)': {
		display: 'grid',
		gridTemplateColumns: '300px 30rem'
	},
	'@media only screen and (max-width: 768px)': {
		display: 'grid',
		gridTemplateColumns: '360px'
	}
}));
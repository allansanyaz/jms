'use client';
import { Button } from '@/styles/buttons/button.styles.jsx';
import { useEffect } from 'react';

const Error = ({ error, reset }) => {
	
	useEffect(() => {
		// Log the error to an error reporting service
		console.log(error);
	}, [error]);
	
	return (
		<div className={'error'}>
			<h2>Oops! Something went wrong.</h2>
			<p>Try refreshing the page or contact the administrator if the problem persists.</p>
			<Button
				variant={'outlined'}
				onClick={() => reset()}
			>
				Refresh
			</Button>
		</div>
	)
}

export default Error;

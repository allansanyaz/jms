'use client';
import { useEffect } from 'react';
import { IErrorProps } from "@/lib/types/definitions";

const Error = ({ error, reset }: IErrorProps) => {
	
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);
	
	return (
		<div className='flex flex-col justify-center align-center'>
			<h2>Oops! Something went wrong.</h2>
			<p>Try refreshing the page or contact the administrator if the problem persists.</p>
			<button
				type="button"
				className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				onClick={() => reset()}
			>
				Refresh
			</button>
		</div>
	)
}

export default Error;

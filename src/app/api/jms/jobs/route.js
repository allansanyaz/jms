import { NextResponse } from 'next/server';
import { jobsAPI } from '@/app/api';

export async function GET() {

	console.log("The jobs API is: " + jobsAPI);

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

	const result = await fetch(jobsAPI, requestOptions)
	.then( response => response.json())
	.catch( error => {
		console.log("Could not fetch data from API due to:");
		console.log('error', error);
	});

	return NextResponse.json(result);

}
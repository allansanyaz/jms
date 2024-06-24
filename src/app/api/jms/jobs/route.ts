import { NextResponse } from 'next/server';
import { jobsAPI } from '@/lib/endpoints';

export async function GET() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const result = await fetch(jobsAPI, {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	})
	.then( response => response.json())
	.catch( error => {
		console.error(`Could not fetch data from ${jobsAPI} API due to:`);
		console.error(error);
	});

	return NextResponse.json(result);

}
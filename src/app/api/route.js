import { NextResponse } from 'next/server';
import { dashboardAPI } from '@/app/api';

export async function GET() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}

	const result = await fetch(dashboardAPI, requestOptions)
	.then( response => response.json())
	.catch( error => {
		console.log("Could not fetch data from API due to:");
		console.log('error', error);
	});

	return NextResponse.json(result);

}
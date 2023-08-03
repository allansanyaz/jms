import { NextResponse } from 'next/server';
import { settingsAPI } from '@/app/api';

export async function GET() {

	console.log("Fetching settings data...")
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}

	const result = await fetch(settingsAPI, requestOptions)
	.then( response => response.json())
	.catch( error => {
		console.log("Could not fetch data from API due to:");
		console.log('error', error);
	});

	const resultObject = JSON.parse(result)
	const processedResult = processSettingsData(resultObject);


	return NextResponse.json(processedResult);

}

// we need to mutate the data here and return the exact form and information we need to reduce operations on the client side

const processSettingsData = (data) => {
	// break result into 4 parts namely
	// 1. General Settings -> server
	// 2. Queue Settings -> queues
	// 3. Nodes Settings -> nodes
	// 4. Packages Settings -> packages

	const server = processServerSettings(data["Data"][0]);

	return server;
}

const processServerSettings = (serverSettings) => {

	// some parameters missing for the server settings
	const settings = serverSettings["Settings"];

	let serverName = settings[0]["Name"];
	let defaultQueue = settings[1]["Value"];

	return {serverName, defaultQueue};
}
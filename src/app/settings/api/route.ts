import { NextResponse } from 'next/server';
import { settingsAPI } from '@/lib/endpoints';

export async function GET() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const result = await fetch(settingsAPI, {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	})
	.then( response => response.json())
	.catch( error => {
		console.error(`Could not fetch data from ${settingsAPI} API due to:`);
		console.error(error);
	});

	const resultObject = JSON.parse(result)
	const processedResult = processSettingsData(resultObject);


	return NextResponse.json(processedResult);

}

// we need to mutate the data here and return the exact form and information we need to reduce operations on the client side

const processSettingsData = (data: any) => {

	const server = processServerSettings(data["Data"][0]);

	return server;
}

const processServerSettings = (serverSettings: any) => {

	// some parameters missing for the server settings
	const settings = serverSettings["Settings"];

	let serverName = settings[0]["Name"];
	let defaultQueue = settings[1]["Value"];

	return {serverName, defaultQueue};
}
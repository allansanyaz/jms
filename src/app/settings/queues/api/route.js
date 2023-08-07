import { NextResponse } from 'next/server';
import { queuesAPI } from '@/app/api';

export async function GET() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

	const result = await fetch(queuesAPI, requestOptions)
	.then( response => response.json())
	.catch( error => {
		console.log("Could not fetch data from API due to:");
		console.log('error', error);
	});

	const resultObject = JSON.parse(result);
	const processedResult = processQueuesData(resultObject);

	return NextResponse.json(processedResult);

}

// we need to mutate the data here and return the exact form and information we need to reduce operations on the client side

const processQueuesData = (data) => {
	// break result into 4 parts namely
	// 1. General Settings -> server
	// 2. Queue Settings -> queues
	// 3. Nodes Settings -> nodes
	// 4. Packages Settings -> packages

	const queueData = processQueueSettings(data["Data"]);

	return queueData;
}

const processQueueSettings = (queueSettings) => {

	// some parameters missing for the server settings
	// we want the queue type and resources
	let queueData = {};

	queueSettings.forEach((queue) => {
		const queueName = queue.QueueName;
		// initialise the object
		queueData[queueName] = {};
		// get the section settings
		const sectionSettings = queue.SettingsSections[0].Settings;
		sectionSettings.forEach((setting) => {
			queueData[queueName][setting.Name] = setting.Value;
		});
	});

	return queueData;
}
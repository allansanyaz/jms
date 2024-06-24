import { NextResponse } from 'next/server';
import { queuesAPI } from '@/lib/endpoints';

export async function GET() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const result = await fetch(queuesAPI, {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	})
	.then( response => response.json())
	.catch( error => {
		console.error(`Could not fetch data from ${queuesAPI} API due to:`);
		console.error(error);
	});

	const resultObject = JSON.parse(result);
	const processedResult = processQueuesData(resultObject);

	return NextResponse.json(processedResult);

}

// we need to mutate the data here and return the exact form and information we need to reduce operations on the client side

const processQueuesData = (data: any) => {

	const queueData = processQueueSettings(data["Data"]);

	return queueData;
}

const processQueueSettings = (queueSettings: any) => {

	// some parameters missing for the server settings
	// we want the queue type and resources
	let queueData: any = {};

	queueSettings.forEach((queue: any) => {
		const queueName: any = queue.QueueName;
		// initialise the object
		queueData[queueName] = {};
		// get the section settings
		const sectionSettings = queue.SettingsSections[0].Settings;
		sectionSettings.forEach((setting: any) => {
			queueData[queueName][setting.Name] = setting.Value;
		});
	});

	return queueData;
}
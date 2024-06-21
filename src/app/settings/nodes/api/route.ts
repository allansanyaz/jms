import { NextResponse } from 'next/server';
import { nodesAPI } from '@/lib/endpoints';

export async function GET() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const result = await fetch(nodesAPI, {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	})
	.then( response => response.json())
	.catch( error => {
		console.log("Could not fetch data from API due to:");
		console.log('error', error);
	});

	const resultObject = JSON.parse(result);
	const processedResult = processNodesData(resultObject);

	return NextResponse.json(processedResult);

}

// we need to mutate the data here and return the exact form and information we need to reduce operations on the client side

const processNodesData = (data: any) => {

	const nodeData = processNodeSettings(data);

	return nodeData;
}

const processNodeSettings = (nodeSettings: any) => {

	// some parameters missing for the server settings
	// we want the node type and resources
    let nodeData: any = {};
    nodeSettings.forEach((node: any) => {
        const nodeName = node.name;
        nodeData[nodeName] = {...node};
    });

	return nodeData;
}
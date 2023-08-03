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

	// process the result
	const resultObject = JSON.parse(result)
	const processedResult = processDashboardData(resultObject);

	return NextResponse.json(processedResult);

}

// we need to mutate the data here and return the exact form and information we need to reduce operations on the client side

const processDashboardData = (dashboardInformation) => {
	const nodesOnline = processNodesOnline(dashboardInformation.nodes);
	const {coreData, nodeData} = processCpuUsage(dashboardInformation.nodes);
	const freeStorage = processFreeStorage(dashboardInformation.disk);
	const queueData = processQueue(dashboardInformation.queue);

	return {nodesOnline, coreData, nodeData, freeStorage, queueData};

}

const processNodesOnline = (nodesOnline) => {
	// get the number of nodes online
	const numberOfNodes = nodesOnline.length;
	const freeStates = nodesOnline.filter((node) => node.state === 'free').length;
	const usage = (freeStates / numberOfNodes) * 100;

	return `${freeStates}/${numberOfNodes}(${usage}%)`;
}

const processCpuUsage = (cpuUsage) => {
	// get cores information from the name
	let coreNames = cpuUsage.map((cpu) => cpu.name);
	let coreData = {};
	let nodeData = {};

	coreNames.forEach((coreName) => {
		// filter for the desired name in our cpuUsage array
		const core = cpuUsage.filter((cpu) => cpu.name === coreName);
		// get the core information
		const coreInformation = core[0];
		const state = coreInformation.state; 
		const busyCores = parseInt(coreInformation.busy_cores);
		const freeCores = parseInt(coreInformation.free_cores);
		// calculate the usage
		const usageInt = (busyCores / freeCores);
		const usage = usageInt * 100;
		coreData[coreName] = {'cpuUsage': `${busyCores}/${freeCores}(${usage}%)`};

		// get information for the jobs running
		coreData[coreName]['jobsRunning'] = coreInformation.jobs.length;
		coreData[coreName]['jobs'] = coreInformation.jobs;

		// set the node information
		nodeData[coreName] = {
			coreState: state,
			totalCores: freeCores,
			busyCores: busyCores,
			freeCores: freeCores-busyCores,
			usedCores: usageInt,
		};

	});

	return {coreData, nodeData};
	
}

const processFreeStorage = (storage) => {
	return storage.available_space;
}

const processQueue = (queue) => {
	// note that the order for our queue is as follows:
	// username, job id, job name, queue, state, nodes, cores, walltime, options
	// up till n-2
	// just pull out the rows

	const queueData = queue.rows;

	return queueData;
}
'use client';
import { useState, useEffect } from 'react';
import CardComponent from "@/components/card/card.component.jsx";
import { Dashboard } from '@/styles/dashboard/dashboard.styles.jsx';
import {
	CustomStack,
	CustomDivider,
} from '@/styles/layout/layout.styles.jsx';
import { CustomTypography } from '@/styles/typography/typography.styles';
import { DashboardIconComponent } from "@/styles/dashboard/dashboard.styles.jsx";
import NodesComponent from "@/components/nodes/nodes.component.jsx";
import QueueComponent from "@/components/queue/queue.component.jsx";
import axios from 'axios';

const DashboardComponent = () => {
	
	const [dashboardData, setDashboardData] = useState({});
	const [dashboardDescription, setDashboardDescription] = useState([]);
	const [cpuNames, setCpuNames] = useState([]);
	const [nodeInformation, setNodeInformation] = useState({});

	useEffect( () => {
		axios.get('/api/')
			.then((response) => {
				const data = JSON.parse(response.data);
				// set the dashboard data
				setDashboardData(data);
				// process the dashboard data
				processDashboardData(data);
				
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const processDashboardData = (dashboardInformation) => {
		const nodesOnline = processNodesOnline(dashboardInformation.nodes);
		const cpuUsage = processCpuUsage(dashboardInformation.nodes);

		const freeStorage = processFreeStorage(dashboardInformation.disk);

		// get the first cpu key
		const cpuKey = Object.keys(cpuUsage)[0];
		//load the descriptions
		const tempDescriptions = [nodesOnline, cpuUsage[cpuKey]['cpuUsage'], cpuUsage[cpuKey]['jobsRunning'], freeStorage];

		setDashboardDescription(tempDescriptions);
	}

	const processNodesOnline = (nodesOnline) => {
		// get the number of nodes online
		const numberOfNodes = nodesOnline.length;
		const freeStates = nodesOnline.filter((node) => node.state === 'free').length;
		const usage = (freeStates / numberOfNodes) * 100;

		return `${freeStates}/${numberOfNodes}(${usage}%)`
	}

	const processCpuUsage = (cpuUsage) => {
		// get cores information from the name
		let coreNames = cpuUsage.map((cpu) => cpu.name);
		// set the core names
		setCpuNames(coreNames);
		// loop through the names and get the relevant information
		let coreData = {};
		let nodeData = {}

		coreNames.forEach((coreName) => {
			// filter for the desired name in our cpuUsage array
			const core = cpuUsage.filter((cpu) => cpu.name === coreName);
			// get the core information
			const coreInformation = core[0];
			const state = coreInformation.state; 
			const busyCores = parseInt(coreInformation.busy_cores);
			const freeCores = parseInt(coreInformation.free_cores);
			// calculate the usage
			const usageInt = (busyCores / freeCores)
			const usage = usageInt * 100;
			coreData[coreName] = {'cpuUsage': `${busyCores}/${freeCores}(${usage}%)`};

			// get information for the jobs running
			coreData[coreName]['jobsRunning'] = coreInformation.jobs.length;

			// set the node information
			nodeData[coreName] = {
				coreState: state,
				totalCores: freeCores,
				busyCores: busyCores,
				freeCores: freeCores-busyCores,
				usedCores: usageInt,
			}

		});
		
		setNodeInformation(nodeData);

		return coreData;
		
	}

	const processFreeStorage = (storage) => {
		return storage.available_space;
	}

	return (
		<CustomStack
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				flexWrap: 'wrap',
				gap: '1rem',
				padding: '0 12px 12px 12px',
				border: '2px solid #B2BEB5',
				borderRadius: '4px',
				boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
				width: '100%',
			}}
		>
			<CustomStack
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: '1rem',
					paddingTop: '1rem',
				}}
			>
				<DashboardIconComponent color={'primary'} sx={{ fontSize: '2.5rem' }} />
				<CustomTypography
					variant={'h3'}
					sx={{
						textTransform: 'uppercase',
						fontWeight: '500',
					}}
				>
					Dashboard
				</CustomTypography>
			</CustomStack>
			
			<CustomDivider sx={{ my: 0 }} />
			
			<CustomStack
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					flexWrap: 'wrap',
					gap: '1rem',
				}}
			>
				{
					dashboardList.map((_, idx) => (
							<CardComponent key={idx} title={dashboardList[idx]} description={dashboardDescription[idx]} idx={idx} />
						)
					)
				}
			</CustomStack>
			
			<CustomDivider sx={{ my: 2 }} />
			
			<Dashboard
			
			>
				<NodesComponent 
					nodeList={cpuNames} 
					nodeInformation={nodeInformation} 
				/>
				<QueueComponent />
			</Dashboard>
		</CustomStack>
	)
}

export default DashboardComponent;

const dashboardList = ["Nodes Online", "CPU Usage", "Jobs Running", "Free Storage"];
const dashboardDescription = ["1/1(100%)", "1/64(1%)", "12", "5TB"];

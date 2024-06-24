'use client';
import { useState, useEffect } from 'react';
import CardComponent from "@/components/card/card.component";
import { Dashboard } from '@/styles/dashboard/dashboard.styles';
import {
	CustomStack,
	CustomDivider,
} from '@/styles/layout/layout.styles';
import { CustomTypography } from '@/styles/typography/typography.styles';
import { DashboardIconComponent } from "@/styles/dashboard/dashboard.styles";
import NodesComponent from "@/components/nodes/nodes.component";
import QueueComponent from "@/components/queue/queue.component";
import axios from 'axios';

const DashboardComponent = () => {
	
	const [dashboardDescription, setDashboardDescription] = useState<string[]>([]);
	const [cpuNames, setCpuNames] = useState<string[]>([]);
	const [nodeInformation, setNodeInformation] = useState({});
	const [rowData, setRowData] = useState([]);

	useEffect( () => {
		axios.get('/api/')
			.then((response) => {
				const data = response.data;
				// set the dashboard description state data
				const cpuNames = Object.keys(data.coreData)
				const firstCore = cpuNames[0];
				setDashboardDescription([
					data.nodesOnline,
					data.coreData[firstCore].cpuUsage,
					data.coreData[firstCore].jobsRunning,
					data.freeStorage
				]);
				// CPU names
				setCpuNames(cpuNames);
				setNodeInformation(data.nodeData);
				// row data
				setRowData(data.queueData);
				
			})
			.catch((error) => {
				console.error('Error fetching data from the /api endpoint')
				console.error(error);
			});
	}, []);

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
				<QueueComponent rowData={rowData} />
			</Dashboard>
		</CustomStack>
	)
}

export default DashboardComponent;

const dashboardList = ["Nodes Online", "CPU Usage", "Jobs Running", "Free Storage"];

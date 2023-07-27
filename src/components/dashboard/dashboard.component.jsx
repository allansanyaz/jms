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

const DashboardComponent = () => {
	
	// perform the fetch from this component
	
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
				<NodesComponent />
				<QueueComponent />
			</Dashboard>
		</CustomStack>
	)
}

export default DashboardComponent;

const dashboardList = ["Nodes Online", "CPU Usage", "Jobs Running", "Storage"];
const dashboardDescription = ["1/1(100%)", "1/64(1%)", "12", "5TB"];

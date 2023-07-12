import CardComponent from "@/components/card/card.component.jsx";
import { Dashboard } from '@/styles/dashboard/dashboard.styles.jsx';
import {
	CustomStack,
	CustomDivider,
} from '@/styles/layout/layout.styles.jsx';
import NodesComponent from "@/components/nodes/nodes.component.jsx";
import QueueComponent from "@/components/queue/queue.component.jsx";

const DashboardComponent = () => {
	return (
		<CustomStack
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				flexWrap: 'wrap',
				gap: '1rem',
			}}
		>
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

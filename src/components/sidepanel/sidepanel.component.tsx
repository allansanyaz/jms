import {
	CustomDivider,
	CustomStack
} from '@/styles/layout/layout.styles';
import UserComponent from '@/components/user/user.component';
import ToolsComponent from '@/components/sidepanel/tools.component';
export const SidePanelComponent = () => {
	return (
		<CustomStack
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				width: '100%',
				backgroundColor: '#A9A9A9',
				border: '2px solid #B2BEB5',
				borderRadius: '4px',
				boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
			}}
		>
			<UserComponent />
			<CustomDivider sx={{ my: 2 }} />
			<ToolsComponent />
			
		</CustomStack>
	)
}

export default SidePanelComponent;

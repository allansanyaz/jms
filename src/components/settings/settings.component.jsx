import { CustomTypography } from "@/styles/typography/typography.styles";
import {
	CustomDivider,
	CustomStack
} from "@/styles/layout/layout.styles";
import { SettingsIconComponent } from "@/styles/tools/tools.styles";
import TabComponent from "@/components/tabs/tabs.component";

const SettingsComponent = () => {
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
				<SettingsIconComponent color={'primary'} sx={{ fontSize: '2.5rem' }} />
				<CustomTypography
					variant={'h3'}
					sx={{
						textTransform: 'uppercase',
						fontWeight: '500',
					}}
				>
					Settings
				</CustomTypography>
			</CustomStack>
			
			<CustomDivider sx={{ my: 0 }} />
			<TabComponent />
			
		</CustomStack>
	)
}

export default SettingsComponent;

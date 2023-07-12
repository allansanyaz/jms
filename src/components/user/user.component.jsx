import {
	CustomStack
} from '@/styles/layout/layout.styles.jsx';
import { CustomTypography } from '@/styles/typography/typography.styles.jsx';
import AvatarComponent from '@/components/icons/avatar.icon.component.jsx';
const UserComponent = () => {
	return (
		<CustomStack
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				alignItems: 'center',
				paddingTop: '0.5rem',
			}}
		>
			<CustomTypography variant={'body1'} gutterBottom>
				Welcome, Someone
			</CustomTypography>
			<AvatarComponent name={'Someone'} image={null} />
		</CustomStack>
	)
}

export default UserComponent

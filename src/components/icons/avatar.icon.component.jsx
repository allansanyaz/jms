'use client';
import Avatar from '@mui/material/Avatar';
import { CustomStack } from '@/styles/layout/layout.styles';

const AvatarComponent = ({ name, image }) => {

	return (
		<CustomStack
			direction='column'
		>
			<Avatar
				src={image}
				alt={name}
				sx={{
					bgcolor: '#f50057',
					width: '128px',
					height: '128px',
				}}
			/>
		</CustomStack>
	)
}

export default AvatarComponent

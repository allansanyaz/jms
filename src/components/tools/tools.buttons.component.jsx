'use client';
import {
	CustomStack
} from "@/styles/layout/layout.styles";
import { Button } from "@/styles/buttons/button.styles";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';

const ToolsButtonsComponent = ({ toolComponent, buttonTitle }) => {
	return (
		<CustomStack
			sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
			}}
		>
			{
				toolComponent === 'tools' ?
					(
						<Button>
							<PlayArrowIcon sx={{ fontSize: '1.5rem' }} />
							Custom Job
						</Button>
					) :
					(
						<div>
						</div>
					)
				}
			
			
			<Button
				backgroundColor={'#47a447'}
				hoverColor={'#47a44750'}
			>
				<AddIcon sx={{ fontSize: '1.5rem' }} />
				{buttonTitle}
			</Button>
			
		</CustomStack>
	)
}

export default ToolsButtonsComponent;

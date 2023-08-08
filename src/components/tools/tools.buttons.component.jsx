'use client';
import {
	CustomStack
} from "@/styles/layout/layout.styles";
import { Button } from "@/styles/buttons/button.styles";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';

const ToolsButtonsComponent = ({ toolComponent, buttonTitle, buttonFunction }) => {
	
	const onButtonClick = () => {
		switch (toolComponent) {
			case 'tools':
				buttonFunction(true);
				break;
			case 'custom':
				console.log("Custom job button clicked");
				break;
			default:
				console.log("No button clicked");
		}
	}
	
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
						<Link className={'customlink'} href={'/tools/custom'}>
							<Button>
								<PlayArrowIcon sx={{ fontSize: '1.5rem' }} />
								Custom Job
							</Button>
						</Link>
					) :
					(
						<div>
						</div>
					)
				}
			
			
			<Button
				backgroundColor={'#47a447'}
				hoverColor={'#47a44750'}
				onClick={() => onButtonClick()}
			>
				<AddIcon sx={{ fontSize: '1.5rem' }} />
				{buttonTitle}
			</Button>
			
		</CustomStack>
	)
}

export default ToolsButtonsComponent;

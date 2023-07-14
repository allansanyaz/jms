'use client';
import { CustomStack } from '@/styles/layout/layout.styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { DashboardIconComponent } from "@/styles/dashboard/dashboard.styles.jsx";
import { BuildIconComponent } from "@/styles/tools/tools.styles.jsx";
import SettingsIcon from '@mui/icons-material/Settings';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import Link from 'next/link';

const IconList = [
	<DashboardIconComponent key={1} color={'primary'} sx={{ fontSize: '2rem' }} />,
	<BuildIconComponent key={2} color={'primary'} sx={{ fontSize: '2rem' }} />,
	<AccountTreeIcon key={3} color={'primary'} sx={{ fontSize: '2rem' }} />,
	<HistoryToggleOffIcon key={4} color={'primary'} sx={{ fontSize: '2rem' }} />,
	<SettingsIcon key={5} color={'primary'} sx={{ fontSize: '2rem' }} />
];

const ToolsComponent = () => {
	return (
		<CustomStack
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				backgroundColor: '#A9A9A9',
				border: '2px solid #B2BEB5',
				borderRadius: '4px',
				boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
				width: '100%',
			}}
		>
			<List>
				{
					toolMenuList.map((text, index) => (
						<ListItem key={index}>
							<Link className={'customlink'} href={toolLinks[index]}>
								<ListItemButton>
									<ListItemIcon>
										{IconList[index]}
									</ListItemIcon>
									<ListItemText primary={text} />
								</ListItemButton>
							</Link>
						</ListItem>
					))
				}
			</List>
		
		</CustomStack>
	)
}

export default ToolsComponent;

const toolLinks = ["/", "/tools", "/workflows", "/jobhistory", "/settings"]
const toolMenuList = ["Dashboard", "Tools", "Workflows", "Job History", "Settings"]

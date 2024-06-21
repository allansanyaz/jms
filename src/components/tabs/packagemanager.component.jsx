import * as React from "react";
import { useState } from "react";
import { CustomDivider, CustomStack } from '@/styles/layout/layout.styles.jsx';
import { CustomTypography } from "@/styles/typography/typography.styles";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from "@mui/material/TextField";
import { Button } from "@/styles/buttons/button.styles.tsx";
import Box from '@mui/material/Box';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';

const PackagesComponent = () => {
	
	const [node, setNode] = useState(nodeList[0]);
	
	const onNodeChange = (event, newNode) => {
		setNode(newNode);
	}
	
	return (
		<CustomStack
			direction={'column'}
			sx={{
				border: '2px solid #B2BEB5',
				padding: '1rem',
				borderRadius: '4px',
				boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
			}}
		>
			<CustomTypography variant={'body2'} sx={{ fontWeight: '600', paddingBottom: '1rem' }} >
				Cluster nodes
			</CustomTypography>
			
			<ToggleButtonGroup
				value={node}
				exclusive
				onChange={onNodeChange}
				aria-label="Cluster queues"
			>
				{
					nodeList.map((node, index) => (
						<ToggleButton key={index} value={node} aria-label={node}>
							{node}
						</ToggleButton>
					))
				}
			</ToggleButtonGroup>
			
			<CustomDivider sx={{ my: 2 }} />
			
			<Box
				component="div"
				sx={{
					display: 'grid',
					gridTemplateColumns: '1fr',
					gap: '1rem',
				}}
				noValidate
				autoComplete="off"
			>
				<TextField
					id="packages"
					label="Enter Packages"
					variant="outlined"
					multiline
					maxRows={8}
					helperText="Enter packages to install, one per line"
				/>
			</Box>
			
			<Button variant={'contained'} sx={{ width: '240px', marginTop: '1rem' }}>
				<InstallDesktopIcon sx={{ fontSize: '1.5rem', marginRight: '0.5rem', color: 'white' }} /> Install Packages
			</Button>
		
		</CustomStack>
	)
}

export default PackagesComponent;

const nodeList = ["Chewbacca", "Mace"]
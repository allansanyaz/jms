import * as React from "react";
import { useState } from "react";
import { CustomDivider, CustomStack } from '@/styles/layout/layout.styles.jsx';
import { CustomTypography } from "@/styles/typography/typography.styles";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from "@mui/material/TextField";
import {AddButton, Button, DeleteButtonTrash, EditButton} from "@/styles/buttons/button.styles.jsx";
import Box from '@mui/material/Box';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from "@mui/material/Tooltip";
const NodesComponent = () => {
	
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
					gridTemplateColumns: 'repeat(2, 1fr)',
					gap: '1rem',
				}}
				noValidate
				autoComplete="off"
			>
				<TextField
					id="state"
					label="Node State"
					variant="outlined"
					defaultValue={'Free'}
				/>
				
				<TextField
					id="processor-number"
					label="Number of processors"
					variant="outlined"
					type={'number'}
					defaultValue={64}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				
				<TextField
					id="other-properties"
					label="Other properties"
					variant="outlined"
					defaultValue={'Opteron'}
				/>
			</Box>
			
			<CustomStack
				direction={'row'}
				sx={{
					display: 'flex',
					flexDirection: 'row',
					gap: '1rem',
					justifyContent: 'space-between',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row'
					}}
				>
					<Button variant={'contained'} sx={{ width: '150px', marginTop: '1rem' }}>Setup Node</Button>
					<CustomStack
						direction={'row'}
						sx={{
							marginTop: '1rem',
						}}
					>
						<Tooltip title="Add" placement="top">
							<AddButton sx={{ fontSize: '2.0rem', color: 'green' }} />
						</Tooltip>
						<Tooltip title="Delete" placement="top">
							<DeleteButtonTrash sx={{ fontSize: '1.9rem', color: 'red' }} />
						</Tooltip>
					</CustomStack>
				</Box>
				<Button variant={'contained'} sx={{ width: '180px', marginTop: '1rem' }}>
					<SaveIcon sx={{ fontSize: '1.5rem', marginRight: '0.5rem', color: 'white' }} /> Save Node
				</Button>
			</CustomStack>
			
		</CustomStack>
	)
}

export default NodesComponent;

const nodeList = ["mace"]
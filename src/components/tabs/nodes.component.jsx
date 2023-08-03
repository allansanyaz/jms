import * as React from "react";
import { useState, useEffect } from "react";
import { CustomDivider, CustomStack } from '@/styles/layout/layout.styles.jsx';
import { CustomTypography } from "@/styles/typography/typography.styles";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from "@mui/material/TextField";
import {AddButton, Button, DeleteButtonTrash, EditButton} from "@/styles/buttons/button.styles.jsx";
import Box from '@mui/material/Box';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";

const NodesComponent = () => {
	
	const [nodeList, setNodeList] = useState([]);
	const [node, setNode] = useState('mace');
	const [nodeData, setNodeData] = useState({});

	useEffect(() => {
		axios.get('/settings/nodes/api')
			.then((response) => response.data)
			.then((data) => {
				setNodeList(Object.keys(data));
				setNodeData(data);
			})
			.catch((error) => {
				console.log(error)
			});
	}, []);
	
	const onNodeChange = (event, newNode) => {
		if(newNode !== null) {
			setNode(newNode);
		}
	}
	
	return (
		<>
			{	
				(nodeList.length < 1) ?
				(
					<Box 
						sx={{ 
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<CircularProgress />
							<CustomTypography
								variant="body2"
								sx={{
									textTransform: 'capitalize',
									width: '100%',
									textAlign: 'center',
								}}
							>
								Loading...
							</CustomTypography>.
					</Box>
				):		
				(
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
								defaultValue={nodeData[node].state}
							/>
							
							<TextField
								id="processor-number"
								label="Number of processors"
								variant="outlined"
								type={'number'}
								defaultValue={nodeData[node].num_cores}
								InputProps={{ inputProps: { min: 0 } }}
							/>
							
							<TextField
								id="other-properties"
								label="Other properties"
								variant="outlined"
								value={nodeData[node].other}
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
		</>
	)
}

export default NodesComponent;

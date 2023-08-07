'use client';
import { useState, useEffect } from 'react';
import Stack from "@mui/material/Stack";
import Box from '@mui/material/Box';
import { CustomTypography } from '@/styles/typography/typography.styles';
import { CustomDivider } from '@/styles/layout/layout.styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ResponsiveCircle from '@/components/icons/responsive.circle.component.jsx';
import LanIcon from '@mui/icons-material/Lan';
import CircularProgress from '@mui/material/CircularProgress';

const NodesComponent = ({ nodeList, nodeInformation }) => {

	const [node, setNode] = useState(null);
	const [progress, setProgress] = useState(100);
	const [coreState, setCoreState] = useState("Free");
	const [totalCores, setTotalCores] = useState(null);
	const [freeCores, setFreeCores] = useState(null);
	const [busyCores, setBusyCores] = useState(null);

	useEffect(() => {
		setNode(nodeList[0]);
		if(Object.keys(nodeInformation).length > 0) {
			calculateNodeMetrics();
		}
	}, [node, nodeList, nodeInformation]);
	
	const onNodeSelectionChange = (event) => {
		setNode(event.target.value);
		// change node based on value
		// get percentage of cores used
		calculateNodeMetrics();
		const coresUsed = calculateProgress(totalCores, freeCores);
		
		setProgress(coresUsed);
	};

	const calculateNodeMetrics = () => {
		if(node !== null && nodeInformation[node] !== undefined) {
			setCoreState(nodeInformation[node]['coreState']);
			setTotalCores(nodeInformation[node]['totalCores']);
			setFreeCores(nodeInformation[node]['freeCores']);
			setBusyCores(nodeInformation[node]['busyCores']);
			setProgress(nodeInformation[node]['usedCores']);
		}
	}

	const calculateProgress = (total, free) => {
		return parseInt(free / total);
	}
	
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				border: '1px solid #B2BEB5',
				borderRadius: '0.5rem',
				boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
				width: '100%',
				maxWidth: '360px',
				minWidth: '320px',
				padding: '1rem 0',
			}}
		>
			<Stack
				direction="row"
				spacing={1}
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					width: '100%',
				}}
			>
				<LanIcon key={1} color={'primary'} sx={{ fontSize: '2.5rem' }} />
				<CustomTypography
					variant="h5"
		            gutterBottom
					sx={{
						fontWeight: 'bold',
						textTransform: 'uppercase',
					}}
				>
					Node Usage
				</CustomTypography>
			</Stack>
			
			<CustomDivider sx={{ my: 2 }} />
			
			<Stack
				direction="column"
				spacing={1}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<CustomTypography
					variant="subtitle1"
					sx={{
						fontWeight: '550',
						textTransform: 'capitalize',
						backgroundColor: '#ADD8E6',
						width: '100%',
						textAlign: 'center',
					}}
				>
					Core Usage
				</CustomTypography>
				
				<CustomDivider sx={{ my: 2 }} />

				{
					(nodeList.length < 1 || !coreState || !node) ? 
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
							</CustomTypography>
						</Box>
					) 
					:
					(
						<ResponsiveCircle progress={progress} />
					)
				}
				
				
				{
					(nodeList.length < 1 || !coreState || !node) ? 
					(
						null
					) 
					:
					(
						<>
							<Box
								id='node-select'
								display="flex"
								flexDirection="row"
								justifyContent="center"
								component="form"
								width="100%"
								paddingTop={"1rem"}
								sx={{
									'& .MuiTextField-root': { m: 1, maxWidth: '30rem', minWidth: '15rem' },
								}}
								noValidate
								autoComplete="off"
							>
								<TextField
									id={"node-select"}
									select
									label="Select node"
									onChange={onNodeSelectionChange}
									value={node}
								>
									{
										nodeList.map((node) => (
											<MenuItem key={node} value={node}>
												{node}
											</MenuItem>
										))
									}
								</TextField>
							</Box>
							
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									width: '20rem',
									padding: '0 1rem 0 1rem',
									alignItems: 'center',
								}}
							>
								<Stack
									direction="row"
									spacing={5}
									width="100%"
								>
									<CustomTypography
										variant="body1"
										sx={{
											width: '100%',
											margin: '0 1rem 0 1rem',
											fontWeight: 'bold',
										}}
									>
										State:
									</CustomTypography>
									<CustomTypography
										variant="body1"
										sx={{
											width: '100%',
											margin: '0 1rem 0 1rem',
											textTransform: 'capitalize',
										}}
									>
										{coreState}
									</CustomTypography>
								</Stack>
								
								<Stack
									direction="row"
									spacing={5}
									width="100%"
								>
									
									<CustomTypography
										variant="body1"
										sx={{
											width: '100%',
											margin: '0 1rem 0 1rem',
											fontWeight: 'bold',
										}}
									>
										Total cores:
									</CustomTypography>
									<CustomTypography
										variant="body1"
										sx={{
											width: '100%',
											margin: '0 1rem 0 1rem',
										}}
									>
										{totalCores}
									</CustomTypography>
								</Stack>
								
								<Stack
									direction="row"
									spacing={5}
									width="100%"
								>
									
									<CustomTypography
										variant="body1"
										sx={{
											width: '100%',
											margin: '0 1rem 0 1rem',
											fontWeight: 'bold',
										}}
									>
										Cores Busy:
									</CustomTypography>
									<CustomTypography
										variant="body1"
										sx={{
											width: '100%',
											margin: '0 1rem 0 1rem',
										}}
									>
										{busyCores}
									</CustomTypography>
								</Stack>
								
								<Stack
									direction="row"
									spacing={5}
									width="100%"
								>
									
									<CustomTypography
										variant="body1"
										sx={{
											width: '100%',
											margin: '0 1rem 0 1rem',
											fontWeight: 'bold',
										}}
									>
										Free Cores:
									</CustomTypography>
									<CustomTypography
										variant="body1"
										sx={{
											width: '100%',
											margin: '0 1rem 0 1rem',
										}}
									>
										{freeCores}
									</CustomTypography>
								</Stack>
							</Box>
						</>
					)
				}
			
			</Stack>
			
		</Box>
	)
}

export default NodesComponent;

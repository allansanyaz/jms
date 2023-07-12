'use client';
import { useState } from 'react';
import LanIcon from '@mui/icons-material/Lan';
import Stack from "@mui/material/Stack";
import Box from '@mui/material/Box';
import { CustomTypography } from '@/styles/typography/typography.styles';
import { CustomDivider } from '@/styles/layout/layout.styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ResponsiveCircle from '@/icons/responsive.circle.icon.jsx';
const NodesComponent = () => {
	
	const [node, setNode] = useState(nodeList[0]);
	const [progress, setProgress] = useState(35);
	
	const onNodeSelectionChange = (event) => {
		console.log("Select has changed to:")
		console.log(event.target.value);
		setNode(event.target.value);
		// change node based on value
		setProgress((event.target.value === "Mace") ? 65 : 35);
	};
	
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
					Cores in use
				</CustomTypography>
				
				<CustomDivider sx={{ my: 2 }} />
				
				<ResponsiveCircle progress={progress} />
				
				<Box
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
				>
					<TextField
						id={"node-select"}
						select
						label="Select node"
						defaultValue={nodeList[0]}
						onChange={onNodeSelectionChange}
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
							}}
						>
							Free
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
							64
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
							0
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
							0
						</CustomTypography>
					</Stack>
				</Box>
			
			</Stack>
			
		</Box>
	)
}

export default NodesComponent;

const nodeList = ["Chewbacca", "Mace"]

'use client';
import { useState, useEffect } from "react";
import { CustomTypography } from "@/styles/typography/typography.styles";
import {
	CustomDivider,
	CustomStack
} from "@/styles/layout/layout.styles";
import { BuildIconComponent } from "@/styles/tools/tools.styles";
import ToolsButtonsComponent from "@/components/tools/tools.buttons.component";
import AccordionComponent from "@/components/tools/accordion.component";
import ModalComponent from '@/components/modal/modal.component';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const ToolsComponent = () => {
	
	const [tools, setTools] = useState({});
	const [openModal, setOpenModal] = useState(false);
	const [accordionMenuList, setAccordionMenuList] = useState([]);

	useEffect(() => {
		axios.get('/api/jms/tools')
			.then((response) => response.data)
			.then((data) => {
				setTools(data);
				setAccordionMenuList(Object.keys(data));
			})
			.catch((error) => {
				console.log(error)
			});
	},[]);
	
	return (
		<CustomStack
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				flexWrap: 'wrap',
				gap: '1rem',
				padding: '0 12px 12px 12px',
				border: '2px solid #B2BEB5',
				borderRadius: '4px',
				boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
			}}
		>
			<CustomStack
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: '1rem',
					paddingTop: '1rem',
				}}
			>
				<BuildIconComponent color={'primary'} sx={{ fontSize: '2.5rem' }} />
				<CustomTypography
					variant={'h3'}
					sx={{
						textTransform: 'uppercase',
						fontWeight: '500',
					}}
				>
					Tools
				</CustomTypography>
			</CustomStack>
			
			<CustomDivider sx={{ my: 0 }} />
			<ToolsButtonsComponent toolComponent={'tools'} buttonTitle={'Add Tool'} buttonFunction={setOpenModal} />
			
			{
				openModal ? <ModalComponent openModal={openModal} setOpenModal={setOpenModal} categories={accordionMenuList} /> : null
			}
			
			<CustomDivider sx={{ my: 0 }} />
			{
				(accordionMenuList.length > 0) ? 
				(
					<AccordionComponent accordionMenuList={accordionMenuList} accordionTitle={'Tools'} accordionData={tools} />
				) :
				(
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							width: '100%',
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
			}
		
		</CustomStack>
	)
}

export default ToolsComponent;

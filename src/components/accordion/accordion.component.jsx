'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { CustomTypography } from '@/styles/typography/typography.styles';
import { CustomStack } from '@/styles/layout/layout.styles.jsx';
import { EditButton } from '@/styles/buttons/button.styles.jsx';
import JMSDataGridComponent from '@/components/datagrids/datagrids.component';

const Accordion = styled((props) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	width: '100%',
	'&:not(:last-child)': {
		// borderBottom: 0,
	},
	'&:before': {
		display: 'none',
	},
}));

const AccordionSummary = styled((props) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor:
		theme.palette.mode === 'dark'
			? 'rgba(255, 255, 255, .05)'
			: 'rgba(0, 0, 0, .03)',
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
	borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const CustomEditContainer = styled(EditButton)(() => ({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'flex-start',
	height: '48px',
	'&:hover': {
		cursor: 'pointer',
	}
}));

const CustomAccordion = ({ accordionTitle, accordionItems }) => {

	const [expanded, setExpanded] = React.useState(false);
	
	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	}
	
	const handleEdit = () => {
		console.log('Edit clicked');
	}

	return (
		<CustomStack
			direction={'row'}
			sx={{
				width: '100%',
			}}
		>
			<Accordion expanded={expanded === 'tool-panel1'} onChange={handleChange('tool-panel1')}>
			<AccordionSummary aria-controls="tool-panel1d-content" id="tool-panel1d-header">
				<CustomStack
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<CustomTypography>{ accordionTitle }</CustomTypography>
				</CustomStack>
			</AccordionSummary>
			
			{
				(accordionItems) ?
					(
						<AccordionDetails>
								<JMSDataGridComponent data={accordionItems} />
						</AccordionDetails>
					):
					(null)
			}
			
			</Accordion>
			<CustomEditContainer onClick={handleEdit}>
				<EditButton sx={{ fontSize: '2.5rem' }} />
			</CustomEditContainer>
		</CustomStack>
	)
}

export default CustomAccordion;

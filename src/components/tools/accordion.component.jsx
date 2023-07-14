import { CustomStack } from '@/styles/layout/layout.styles.jsx';
import { CustomTypography } from '@/styles/typography/typography.styles';
import CustomAccordion from '@/styles/accordion/accordion.styles';

const AccordionComponent = () => {
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
				Tools:
			</CustomTypography>
			
			{
				accordionMenuList.map((item, index) => (
					<CustomAccordion key={index} accordionTitle={item} />
				))
			}
		
		</CustomStack>
	)
}

export default AccordionComponent;

const accordionMenuList = ["Administration", "Data Retrieval", "Docking Studies", "Homology Modeling", "Model Assessment", "SANCDB", "Variant Analysis"]

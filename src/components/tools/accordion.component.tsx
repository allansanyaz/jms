import { CustomStack } from '@/styles/layout/layout.styles';
import { CustomTypography } from '@/styles/typography/typography.styles';
import CustomAccordion from '@/components/accordion/accordion.component';
import { IAccordionProps } from "@/lib/types/definitions";

const AccordionComponent = ({ accordionMenuList, accordionTitle, accordionData }: IAccordionProps) => {
	
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
				{accordionTitle}:
			</CustomTypography>
			
			{
				accordionMenuList.map((item, index) => (
					<CustomAccordion key={index} accordionTitle={item} accordionItems={accordionData[item]} />
				))
			}
		
		</CustomStack>
	)
}

export default AccordionComponent;

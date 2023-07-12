import SidePanel from '@/components/sidepanel/sidepanel.component.jsx';
import Dashboard from '@/components/dashboard/dashboard.component.jsx'
import { CustomContainer } from '@/styles/layout/layout.styles.jsx';

import './globals.scss';
export default function Home() {
    return (
        <CustomContainer
            id={'home'}
            sx={{
                margin: '2rem auto 0 0',
                display: 'grid',
                gridTemplateColumns: '225px 1fr',
                gap: '1rem',
            }}
        >
            <SidePanel />
            <Dashboard />
        </CustomContainer>
    )
}

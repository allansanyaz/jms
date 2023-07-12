import Dashboard from '@/components/dashboard/dashboard.component.jsx'
import { CustomContainer } from '@/styles/layout/layout.styles.jsx';
export default function Home() {
    return (
        <CustomContainer
            maxWidth={'xl'}
            sx={{
                marginTop: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Dashboard />
        </CustomContainer>
    )
}

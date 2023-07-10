'use client';
import Dashboard from '@/components/dashboard/dashboard.component.jsx'
import Container from '@mui/material/Container';
export default function Home() {
    return (
        <Container
            maxWidth={'xl'}
            sx={{
                marginTop: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Dashboard />
        </Container>
    )
}

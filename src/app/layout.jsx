import SidePanel from '@/components/sidepanel/sidepanel.component.jsx';
import { CustomContainer } from '@/styles/layout/layout.styles.jsx';
import './globals.scss'

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
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
                    {children}
                </CustomContainer>
            </body>
        </html>
    )
}

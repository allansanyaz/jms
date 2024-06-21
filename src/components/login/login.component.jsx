'use client';
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Button } from '@/styles/buttons/button.styles.tsx';
const LoginComponent = () => {
	return (
		<div style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				width: '100%',
			}}
		>
			<Box
				component="form"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '300px',
					gap: '16px',
				}}
			>
				<h1 style={{ textAlign: 'center' }}>Login</h1>
				<hr />
				<TextField id="username" label="Username" variant="outlined" required />
				<TextField id="password" label="Password" variant="outlined" type="password" required />
				
				<Stack direction="row" spacing={1} justifyContent="space-between">
					<Button variant="contained" color="secondary">Sign In</Button>
					<Button variant="contained">Reset Details</Button>
				</Stack>
			</Box>
		</div>
	)
}

export default LoginComponent;


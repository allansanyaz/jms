'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ServerComponent from "@/components/tabs/server.component";
import QueueComponent from "@/components/tabs/queues.component";
import NodesComponent from "@/components/tabs/nodes.component";
import PackagesComponent from "@/components/tabs/packagemanager.component";

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;
	
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					{children}
				</Box>
			)}
		</div>
	);
}

CustomTabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const TabComponent = () => {
	const [value, setValue] = React.useState(0);
	
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	
	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="Settings Tab">
					<Tab label="Server" {...a11yProps(0)} />
					<Tab label="Queues" {...a11yProps(1)} />
					<Tab label="Nodes" {...a11yProps(2)} />
					<Tab label="Package Manager" {...a11yProps(3)} />
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
				<ServerComponent />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<QueueComponent />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={2}>
				<NodesComponent />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={3}>
				<PackagesComponent />
			</CustomTabPanel>
		</Box>
	);
}

export default TabComponent;

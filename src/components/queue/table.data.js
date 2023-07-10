export const columns = [
	{
		field: 'id',
		headerName: 'ID',
		width: 90
	},
	{
		field: 'jobID',
		headerName: 'Job ID',
		width: 250
	},
	{
		field: 'queue',
		headerName: 'Queue',
		width: 150
	},
	{
		field: 'jobName',
		headerName: 'Job Name',
		width: 250
	},
	{
		field: 'state',
		headerName: 'State',
		width: 50
	},
	{
		field: 'nodes',
		headerName: 'Nodes',
		width: 50
	},
	{
		field: 'cores',
		headerName: 'Cores',
		width: 50
	},
	{
		field: 'walltime',
		headerName: 'Wall Time',
		width: 350
	},
	{
		field: 'delete',
		headerName: 'Delete',
		width: 100
	}
];

export const rows = [
	{ id: 1, jobID: 'JID_123456', queue: 'batch', jobName: 'job1', state: 'R', nodes: 4, cores: 48, walltime: '06:00:00', delete: 'Delete' },
	{ id: 2, jobID: 'JID_123457', queue: 'batch', jobName: 'job2', state: 'R', nodes: 2, cores: 32, walltime: '12:00:00', delete: 'Delete' },
	{ id: 3, jobID: 'JID_123458', queue: 'batch', jobName: 'job3', state: 'R', nodes: 1, cores: 12, walltime: '08:00:00', delete: 'Delete' },
];
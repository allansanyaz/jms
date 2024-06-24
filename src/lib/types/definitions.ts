import React from 'react';

// React Children Props
export interface IChildrenProps {
    children: React.ReactNode;
}
// Error Props
export interface IErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export interface IAccordionProps {
	accordionMenuList: string[];
	accordionTitle: string;
	accordionData: any
}

export interface ICustomAccordionProps {
	accordionTitle: string;
	accordionItems: { [key: string]: string | number }
}

export interface IJMSDataGridComponentProps {
    data: { [key: string]: IToolDataGridProps }
}

export interface IToolDataGridProps {
	id: number;
	toolName: string;
	toolDescription: string;
	toolPublic: IToolPublicOptions;
	toolVersion: string;
}

export enum IToolPublicOptions {
	YES = "Yes",
	NO = "No"
}

export interface ICardComponentProps {
	title: string;
	description: string;
	idx: number;
}

export interface IDashboardDescriptionProps {
	nodesOline: string;
	cpuUsage: string;
	jobsRunning: string;
	freeStorage: string;
}

export interface IJobHistoryComponentDataProps {
	id: number;
	jobID: string;
	name: string;
	description: string;
	toolVersion: string;
	timeSubmitted: string;
}

export interface INodeComponentProps {
	nodeList: string[];
	nodeInformation: { [key: string]: INodeInformationProps };
}

export interface INodeInformationProps {
	coreState: string;
	totalCores: string;
	freeCores: string;
	busyCores: string;
	usedCores: string;
}

export interface IQueueComponentResponseProps {
	job_id: string;
	values: string[];
}

export interface IQueueComponentDataProps {
	id: number;
	jobID: string;
	username: string;
	queue: string;
	jobName: string;
	state: string;
	nodes: string;
	cores: string;
	walltime: string;
}

export interface INodeComponentDataProps {
	state: string;
	num_cores: string;
	other: string;
}

export interface IQueuesComponentResponseProps {
	enabled: boolean;
	started: boolean;
	queue_type: string;
}

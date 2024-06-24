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
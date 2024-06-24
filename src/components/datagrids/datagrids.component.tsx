'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { CustomTypography } from "@/styles/typography/typography.styles";
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';
import RunComponent from '@/components/tools/run.component';
import {
    IJMSDataGridComponentProps,
    IToolDataGridProps,
    IToolPublicOptions
} from "@/lib/types/definitions";

import '@/styles/dashboard/dashboard.styles.css';

const JMSDataGridComponent = ({ data }: IJMSDataGridComponentProps) => {

    const [rows, setRows] = useState<IToolDataGridProps[]>();

    const columns = [
        {
            field: 'toolName',
            headerName: 'Tool Name',
            width: 200,
            headerClassName: 'queue-header'
        },
        {
            field: 'toolDescription',
            headerName: 'Tool Description',
            width: 350,
            headerClassName: 'queue-header'
        },
        {
            field: 'public',
            headerName: 'Public',
            width: 100,
            headerClassName: 'queue-header'
        },
        {
            field: 'latestVersion',
            headerName: 'Latest Version',
            width: 100,
            headerClassName: 'queue-header'
        },
        {
            field: 'options',
            headerName: 'Options',
            width: 200,
            headerClassName: 'queue-header',
            renderCell: (params: any) => (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <RunComponent
                        dataID={params.id}
                    />
                </Box>
            ),
        },
    ];

    useEffect(() => {
        // convert the object into an array of objects
        const dataArray: IToolDataGridProps[] = Object.keys(data).map((key) => data[key]);
        const rowData = initialiseRowData(dataArray);
        setRows(rowData);

    }, []);

    const initialiseRowData = (rowData: IToolDataGridProps[]) => {
        let data: IToolDataGridProps[] = [];
        let counter = 1;

        if(rowData) {
            rowData.forEach((row) => {
                data.push({
                    id: counter,
                    toolName: row.toolName,
                    toolDescription: row.toolDescription,
                    toolPublic: (row.toolPublic) ? IToolPublicOptions.YES : IToolPublicOptions.NO,
                    toolVersion: row.toolVersion,
                });
                counter++;
            });
        }

        return data;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
            }}
        >
            {
                (!!rows?.length) ?
                (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        sx={{
                            width: '100%',
                        }}
                        getRowHeight={() => 'auto'}
                    />
                ):
                (
                    <>
                        <CircularProgress />
                        <CustomTypography
                            variant="body2"
                            sx={{
                                textTransform: 'capitalize',
                                width: '100%',
                                textAlign: 'center',
                            }}
                        >
                            Loading...
                        </CustomTypography>
                    </>
                )
            }
        </Box>
    )
}

export default JMSDataGridComponent;

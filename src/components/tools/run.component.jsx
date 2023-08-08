'use client';
import * as React from "react";
import { Button } from "@/styles/buttons/button.styles.jsx";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const RunComponent = ({ dataID }) => {
    return (
        <>
            <Button backgroundColor={'#FF0000'}>
                <PlayArrowIcon sx={{ fontSize: '1.5rem' }} />
                Run
            </Button>
        </>
    )
}

export default RunComponent;

import { Alert, AlertIcon, AlertTitle, AlertDescription} from '@chakra-ui/react';
import {AlertStatus} from '@chakra-ui/alert/dist/types/alert'
import React from 'react'

interface AlertFieldProps {
    status : AlertStatus,
    title? : string,
    description? : string
}

const AlertField: React.FC<AlertFieldProps> = ({status, title = "", description = ""}) => {
        return (
            <Alert status={status} mt={4} >
                <AlertIcon/>
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{description}</AlertDescription>
            </Alert>
        );
};

export default AlertField
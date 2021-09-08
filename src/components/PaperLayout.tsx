import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react'

interface PaperLayoutProps {
    title : string
    desc? : string

}

const PaperLayout: React.FC<PaperLayoutProps> = ({title, desc, ...rest}) => {
        return <Box p={5} shadow="md" borderWidth="1px" {...rest}>
            <Heading size="md" mb={2}>{title}</Heading>
            <Text>{desc}</Text>
        </Box>;
};

export default PaperLayout
import { Box, Button, Flex, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{fetching : logoutFetching},logout] = useLogoutMutation();

    const [{data,fetching}] = useMeQuery({
        pause: isServer()
    });
    let body = null;
    // data is loading
    if(fetching){
    } 
    //user not logged in
    else if(!data?.me){
        body = (
        <>
            <NextLink href="/login">
                <Link mr={4} color="white">
                    login
                </Link>
            </NextLink>
            <NextLink href="/register">
                <Link color="white">
                    register
                </Link>
            </NextLink>
        </>);
    } 
    else{
        body = (
            <Flex gridGap={4}>
                <Box>{data.me.username}</Box>
                <Button variant="link" color="white" fontWeight="light"
                onClick={() => {logout();}}
                isLoading={logoutFetching}>logout</Button>
            </Flex>
        );
    }
    return (
        <Flex bg="twitter.600" p={4} position="sticky" top={0} zIndex={1}>
            <Box marginLeft="auto">
                {body}
            </Box>
        </Flex>
    );
};

export default NavBar
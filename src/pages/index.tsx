import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { Box, Button, Flex, Heading, Link, Stack} from "@chakra-ui/react";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { PaginatedPosts, Post, PostsQuery, usePostsQuery } from "../generated/graphql";
import PaperLayout from "../components/PaperLayout";
import React, { useEffect, useState } from "react";

type fetchingState = "fetching" | "failed" | "success";

const Index = () => {
    const [variables, SetVariables] = useState(
        {limit : 10, cursor : undefined as string | undefined}
    );
    const [{data,stale,fetching},] = usePostsQuery({variables});

    let fetchS : fetchingState = 'success';
    if(!data && !fetching)
        fetchS = 'failed';
    else if(fetching)
        fetchS = 'fetching';
    
    return (
        <Layout>
            <Flex align="center">
                <Heading>LiReddit</Heading>
                <NextLink href="/create-post">
                    <Link ml="auto">Create Post</Link>
                </NextLink>
            </Flex>
            <br/>
            <Stack spacing={4}>
                {fetchS === "failed" ? 
                <Box>Query Failed, please check your internet connection</Box> : 
                (fetchS === "fetching" ? 
                    <Box>Loading...</Box> : 
                    data?.posts.posts.map((post) =>
                        <PaperLayout key={post._id} title={post.title} desc={`${post.textSnippet}...`}/>
                ))}
            </Stack>
            <Flex mt={8} onClick={() => SetVariables(prev => {
                return {limit : prev.limit, cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt}
            })}>
                {data?.posts.hasMore && 
                <Button mr="auto" ml="auto" isLoading={stale}>Load Next</Button>}
            </Flex>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);

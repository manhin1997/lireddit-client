import NavBar from "../components/NavBar";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { Box, Link } from "@chakra-ui/react";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
    const [{data},] = usePostsQuery({
        variables: {
            limit: 10,
        }
    });
    return (
        <Layout>
            <NextLink href="/create-post">
                <Link>Create Post</Link>
            </NextLink>
            <br/>
            {!data ? 
            null : 
            data?.posts.map((post) => 
                <Box key={post._id.toString()}>
                    {post.title}
                </Box>
            )}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);

import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React from 'react'
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import {useCreatePostMutation} from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient';
import { userIsAuth } from '../utils/userIsAuth';

interface CreatePostProps {

}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
    const router = useRouter();
    const [,createPost] = useCreatePostMutation();
    userIsAuth();
    return (
        <Layout variant="small">
            <Formik initialValues={{title : "", text : ""}} 
                onSubmit={async (values, {setErrors}) => {
                    const result = await createPost({input: values});
                    if(!result.error){
                        router.push('/');
                    }
                }}
            >
            {({isSubmitting, values}) => (
                <Form>     
                    <Box mt={4}>
                        <InputField name="title" 
                        placeholder="Title" 
                        label="Title"/>
                    </Box>
                    <Box mt={4}>
                        <InputField name="text" 
                            placeholder="Description" 
                            label="Description"
                            InputType="TextArea"/>
                    </Box>
                    <Box mt={4}><Button type="submit" colorScheme="teal" isLoading={isSubmitting}>Create Post</Button></Box>
                </Form>
            )}
        </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(CreatePost)
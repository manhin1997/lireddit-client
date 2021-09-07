import React from 'react';
import {Formik, Form} from 'formik';
import {Button, Box } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {

}

const register: React.FC<registerProps> = ({}) => {
    const [,register] = useRegisterMutation();
    const router = useRouter();

    return (
        <Wrapper variant="small">
            <Formik initialValues={{username: '', password: '', email: ''}} 
            onSubmit={async (values, {setErrors}) => {
                const response = await register({options: values});
                if(response.data?.register.errors){
                    setErrors(toErrorMap(response.data.register.errors));
                }
                else if (response.data?.register.user){
                    router.push("/");
                }
                }}>
                {({isSubmitting}) => (
                    <Form>
                        <Box mt={4}>
                            <InputField name="username" 
                            placeholder="username" 
                            label="Username"/>
                        </Box>
                        <Box mt={4}>
                            <InputField name="password" 
                            placeholder="password" 
                            label="Password"
                            type="password"/>
                        </Box>
                        <Box mt={4}>
                            <InputField name="email" 
                            placeholder="email" 
                            label="Email"
                            type="email"/>
                        </Box>
                        <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting}>Register</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient, {ssr: false})(register);
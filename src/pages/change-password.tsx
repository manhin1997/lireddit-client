import { Button } from '@chakra-ui/button';
import { Box, Link } from '@chakra-ui/layout';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useChangePasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import NextLink from 'next/link';
import AlertField from '../components/AlertField';


interface ChangePasswordProps {
}


const ChangePassword: React.FC<ChangePasswordProps> = () => {
    const [,changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");
    const router = useRouter();
    const token = typeof router.query.token === "string" ? router.query.token : "";

    return (
    <Wrapper variant="small">
        <Formik initialValues={{password : '', confirmPassword : ''}} 
        onSubmit={async (values, {setErrors}) => {
            
            if(values.confirmPassword !== values.password){
                setErrors({password: "The password must be the same as the confirm password."});
                return;
            }
            const response = await changePassword(
                {
                    token : token, 
                    newPassword : values.password
                });
            console.log(response);
            if(response.data?.ChangePassword.errors){
                //Show errors
                const errorMap = toErrorMap(response.data.ChangePassword.errors);
                if('token' in errorMap){
                    setTokenError(errorMap.token);
                }
                else{
                    setTokenError("");
                }
                setErrors(errorMap);
            }
            else if(response.data?.ChangePassword.user){
                //Route back to root
                router.push('/');
            }
        }}>
            {({isSubmitting, values}) => (
                <Form>
                    <Box mt={4}>
                        <InputField name="password" 
                        placeholder="Password"
                        label="Password"
                        type="password"/>
                    </Box>
                    <Box mt={4}>
                        <InputField name="confirmPassword" 
                        placeholder="Confirm Password" 
                        label="Confirm Password"
                        type="password"/>
                    </Box>
                    <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting}>Reset Password</Button>
                    {tokenError &&
                    <>
                        <AlertField description = {tokenError} title = {tokenError} status = "error"/>
                        <Box mt={2}>
                            <NextLink href='/forget-password'>
                                <Link color="blue.400">Obtain a new Token</Link>
                            </NextLink>
                        </Box>
                    </>}
                </Form>
            )}
        </Formik>
    </Wrapper>);
};



export default withUrqlClient(createUrqlClient)(ChangePassword)
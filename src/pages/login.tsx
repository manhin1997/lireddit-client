import React from 'react';
import {Formik, Form} from 'formik';
import {Button, Box, Link, Flex} from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { LoginMutationVariables, useLoginMutation, UserNameType } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import FormRadioGroup from '../components/FormRadioGroup';
import NextLink from 'next/link';

interface loginProps {

}

const login: React.FC<loginProps> = ({}) => {
    const [,login] = useLoginMutation();
    const router = useRouter();

    return (
        <Wrapper variant="small">
            <Formik initialValues={{l_username: '', password: '', usernameType : 'Email'}} 
            onSubmit={async (values, {setErrors}) => {
                let submitVal : LoginMutationVariables;
                submitVal = {
                    ...values,
                    usernameType: UserNameType[values.usernameType as keyof typeof UserNameType]
                }
                const response = await login(submitVal);
                if(response.data?.login.errors){
                    console.log(response.data?.login.errors);
                    setErrors(toErrorMap(response.data.login.errors));
                }
                else if (response.data?.login.user){
                    if(typeof router.query.next === 'string'){
                        router.push(router.query.next);
                    }
                    else{
                        router.push("/");
                    }
                }
                }}>
                {({isSubmitting, values}) => (
                    <Form>
                        <FormRadioGroup name="usernameType" radioValues={["Username" , "Email"]}/>       
                        <Box mt={4}>
                            <InputField name="l_username" 
                            placeholder={values.usernameType} 
                            label={values.usernameType}/>
                        </Box>
                        <Box mt={4}>
                            <InputField name="password" 
                            placeholder="password" 
                            label="Password"
                            type="password"/>
                        </Box>
                        <Flex mt={2}>
                            <NextLink href='/forget-password' >
                                <Link color="blue.400" ml="auto">Forget Password</Link>
                            </NextLink>
                        </Flex>
                        <Box><Button type="submit" colorScheme="teal" isLoading={isSubmitting}>Login</Button></Box>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient, {ssr: false})(login);
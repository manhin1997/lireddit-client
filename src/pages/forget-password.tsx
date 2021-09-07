import { Box} from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react'
import AlertField from '../components/AlertField';
import FormRadioGroup from '../components/FormRadioGroup';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper'
import { ForgetPasswordMutationVariables, useForgetPasswordMutation, UserNameType } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface forgetPWProps {

}

type EmailSend = "Success" | "Error" | "Init";

const forgetPW: React.FC<forgetPWProps> = ({}) => {
    const [, forgetPW] = useForgetPasswordMutation();
    const [emailErr, setemailErr] = useState<EmailSend>("Init");
    const router = useRouter();
    return (
        <Wrapper variant="small">
            <Formik initialValues={{l_username: '', usernameType : 'Email'}} 
            onSubmit={async (values) => {
                let submitVal : ForgetPasswordMutationVariables;
                submitVal = {
                    ...values,
                    usernameType: UserNameType[values.usernameType as keyof typeof UserNameType]
                }
                const req = await forgetPW(submitVal);

                if(req.data?.ForgetPassword){
                    //Show success alert to user
                    setemailErr("Success");
                    setTimeout(() => router.push('/'), 4000);
                }
                else{
                    setemailErr("Error");
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
                        <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting}>Send Email</Button>
                        {emailErr == "Success" && <AlertField status="success" description="Token was send successfully, please check your email account"/>}
                        {emailErr == "Error" && <AlertField status="error" title="Email Error: " description="Email cannot be sent"/>}
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(forgetPW)
import React from 'react'
import { useField, FieldHookConfig} from 'formik';
import { FormControl, FormErrorMessage } from '@chakra-ui/form-control';
import { Radio, RadioGroup, Stack } from '@chakra-ui/react';
type FormRadioGroupProps = FieldHookConfig<any> & {
    radioValues : string[];
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = (props) => {
    const [field , meta, helpers] = useField(props);
    return (
        <FormControl isInvalid={!!meta.error}>
            <RadioGroup>
                <Stack direction="row">
                    {props.radioValues.map((radioValue, index) => 
                        <Radio key={index} isChecked={radioValue === field.value} 
                        onChange={() => helpers.setValue(radioValue)}>{radioValue}</Radio>
                    )}
                </Stack>
            </RadioGroup>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
        </FormControl>
    );
};

export default FormRadioGroup
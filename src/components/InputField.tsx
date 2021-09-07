import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { useField, FieldHookConfig} from 'formik';
import React from 'react'

type InputFieldProps = FieldHookConfig<any> & {
    label : string,
    InputType? : "TextArea" | "Input",
};

const InputField: React.FC<InputFieldProps> = (props) => {
    const [field, {error}] = useField(props);
    let InputOrTextArea = props.InputType === "Input" ? Input : Textarea;
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
            <InputOrTextArea {...field} id={field.name} placeholder={props.placeholder} type={props.type}/>
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};

InputField.defaultProps = {
    InputType : "Input"
}

export default InputField
interface FormInstance {
    email: any,
    password: any
}

export default function LoginValidation(values: FormInstance) {
    let errors: Partial<FormInstance> = {};

    // Check if email is empty
    if (values.email === "") {
        errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Email address is invalid';
    }

    // Check if password is empty
    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
    }

    return errors;
}

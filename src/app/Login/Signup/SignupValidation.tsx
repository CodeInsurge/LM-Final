interface NewFormInstant {
    email: any,
    password: any,
    f_name: any,
    l_name: any,
    u_name: any,
}

export default function SignupValidation(values: NewFormInstant) {
    let errors: Partial<NewFormInstant> = {};

    // Check if f_name is empty
    if (values.f_name === "") {
        errors.f_name = 'First Name is required';
    } 
// Check if l_name is empty
    if (values.l_name === "") {
        errors.l_name = 'Last Name is required';
    } 
// Check if u_name is empty
    if (values.u_name === "") {
        errors.u_name = 'User Name is required';
    } 
// Check if email is empty
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

import { OutlinedInput, Button, Alert, Snackbar, Typography } from "@mui/material"
import React, { useEffect } from "react"
import post from "../utils/api"

interface InputProps {
    query?: string
    errorChecker?: (value: string) => boolean
    description: React.ReactNode
    url: string
    body?: Object
    defaultValue?: string
    successCallback?: () => void
    [key: string]: any
}

const TextInput = (props: InputProps) => {
    const [error, setError] = React.useState(false);
    const [value, setValue] = React.useState(props.defaultValue ?? '');

    const handleChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setError(props.errorChecker ? props.errorChecker(value) : false);
        setValue(value);
    }

    useEffect(() => {
        setError(props.errorChecker ? props.errorChecker(value) : false);
    }, []);


    const [open, setOpen] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const update = async () => {
        const success = await post(`${props.url}?key=${props.query ?? 'null'}`, Object.assign({
            value
        }, props.body));
        setSuccess(success);
        setOpen(true);
        if (success && props.successCallback)
            props.successCallback();
    }

    return (
        <>
            <Typography color='#7d7d7d'>
                {props.description}
            </Typography>
            <OutlinedInput
                {...props}
                error={error}
                value={value}
                onChange={handleChange()}
                fullWidth
            ></OutlinedInput>
            <Button variant="outlined" sx={{
                height: 56,
                verticalAlign: 'top'
            }} onClick={update} disabled={error ? true : false}>填完了！</Button>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={
                    success ? 'success' : 'error'
                } sx={{ width: '100%' }}>
                    {success ? '成功啦！' : '诶？失败了。'}
                </Alert>
            </Snackbar>
            <br></br><br></br>
        </>
    )
}

export default TextInput;
import { Typography } from "@mui/material";
import TextInput from "../../components/input";
import Layout from "../../layout";

const NewCol = () => {
    return (
        <Layout title='新增一刊'>
            <Typography variant="h5">
                新增一刊
            </Typography>

            <TextInput
                description='标题'
                url='/api/collection/new'
                successCallback={() => { window.location.href = './'; }}
            >
            </TextInput>
        </Layout>
    );
}

export default NewCol;

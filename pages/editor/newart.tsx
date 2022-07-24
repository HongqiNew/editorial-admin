import { Typography } from "@mui/material";
import TextInput from "../../components/input";
import Layout from "../../layout";

const NewArt = () => {
    return (
        <Layout title='新增一文'>
            <Typography variant="h5">
                新增一文
            </Typography>

            <TextInput
                description='标题'
                url='/api/article/new'
                successCallback={() => { window.location.href = './'; }}
            >
            </TextInput>
        </Layout>
    );
}

export default NewArt;

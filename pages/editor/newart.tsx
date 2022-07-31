import { Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import TextInput from "../../components/input";
import Layout from "../../layout";
import authRedirectUrl from "../../utils/auth";

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

export const getServerSideProps: GetServerSideProps = async ctx => {
    const redirect = await authRedirectUrl(ctx);
    if (redirect) return redirect;

    return {
        props: {}
    }
}

export default NewArt;

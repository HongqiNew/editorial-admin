import { getSession } from "@auth0/nextjs-auth0"
import { GetServerSideProps } from "next"
import { RedirectToEditor, RedirectToLogin } from "../utils/redirect"

const Home = () => {
    return <></>
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    const session = getSession(ctx.req, ctx.res);
    return session ? RedirectToEditor : RedirectToLogin;
}

export default Home;

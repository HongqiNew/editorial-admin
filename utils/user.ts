import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSidePropsContext } from "next";

const getUser = (ctx: GetServerSidePropsContext) => {
    const session = getSession(ctx.req, ctx.res);
    if (!session) {
        return undefined;
    }
    else {
        const user = session.user;
        return { ...user };
    }
}

export default getUser;

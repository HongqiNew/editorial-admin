import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSidePropsContext } from "next";
import isAdmin from "../pages/api/utils/_isAdmin";
import { RedirectToLogin, RedirectToLogout } from "./redirect";

const authRedirectUrl = async (ctx: GetServerSidePropsContext) => {
    const session = getSession(ctx.req, ctx.res);
    if (!session) {
        return RedirectToLogin;
    }
    else if (!(await isAdmin(session))) {
        return RedirectToLogout;
    }
    else {
        return null;
    }
}

export default authRedirectUrl;

import { Session } from "@auth0/nextjs-auth0";
import { ManagementClient } from "auth0";

const isAdmin = async (session: Session) => {
    const client = new ManagementClient({
        domain: 'newhongqi.us.auth0.com',
        clientId: process.env.AUTH0_CLIENT_ID as string,
        clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
        scope: 'read:users read:users_app_metadata',
    })
    const userInfo = await client.getUser({ id: session.user.sub });
    return userInfo.app_metadata?.admin;
}

export default isAdmin;

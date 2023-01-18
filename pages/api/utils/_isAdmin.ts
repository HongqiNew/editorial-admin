import { Session } from '@auth0/nextjs-auth0' 
import { ManagementClient } from 'auth0' 
 
const isAdmin = async (session: Session) => { 
    const client = new ManagementClient({ 
        domain: (process.env.AUTH0_ISSUER_BASE_URL as string).split('/').find(token => token.includes('com')) as string, 
        clientId: process.env.AUTH0_CLIENT_ID as string, 
        clientSecret: process.env.AUTH0_CLIENT_SECRET as string, 
        scope: 'read:users read:users_app_metadata', 
    }) 
    const userInfo = await client.getUser({ id: session.user.sub }) 
    return Boolean(userInfo.app_metadata?.admin) 
} 
 
export default isAdmin

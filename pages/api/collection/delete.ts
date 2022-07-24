import { Claims, getSession, Session, withApiAuthRequired } from "@auth0/nextjs-auth0";
import isAdmin from "../utils/_isAdmin";
import supabaseAdmin from "../utils/_supabaseClient";

export default withApiAuthRequired(async (req, res) => {
    const session = getSession(req, res) as Session;
    const id = req.body.id;
    if (await isAdmin(session)) {
        const { error } = await supabaseAdmin
            .from('hongqicol')
            .delete({
                returning: 'minimal',
            })
            .match({
                id
            });
        if (error) {
            res.status(500).json({ success: false });
        }
        else {
            res.status(200).json({ success: true });
        }
    }
    else {
        res.status(400).json({ success: false });
    }
})

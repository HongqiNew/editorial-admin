import { getSession, Session, withApiAuthRequired } from "@auth0/nextjs-auth0";
import isAdmin from "../utils/_isAdmin";
import supabaseAdmin from "../utils/_supabaseClient";

export default withApiAuthRequired(async (req, res) => {
    const session = getSession(req, res) as Session;
    if (await isAdmin(session)) {
        const key = req.query.key as string;
        let value = req.body.value;
        if (key === 'time')
            value = new Date(value).getTime();
        else if (key === 'tags')
            value = value.split('\n');
        const { error } = await supabaseAdmin
            .from('hongqiart')
            .update({
                [key]: value
            }, {
                returning: 'minimal',
            })
            .match({
                id: req.body.id
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

import { getSession, Session, withApiAuthRequired } from '@auth0/nextjs-auth0'
import isAdmin from '../utils/_isAdmin'
import supabaseAdmin from '../utils/_supabaseClient'

export default withApiAuthRequired(async (req, res) => {
    const session = getSession(req, res) as Session
    if (await isAdmin(session)) {
        const newArt = await supabaseAdmin.from('art').insert({
            title: '新文章',
            time: new Date().getTime()
        })
        const { data, error } = newArt
        if (error) {
            res.status(500).json({ success: false })
        }
        else {
            res.status(200).json({ success: true, id: data[0].id })
        }
    }
    else {
        res.status(400).json({ success: false })
    }
})

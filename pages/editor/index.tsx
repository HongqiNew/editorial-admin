import { ListItemButton, List, ListItem, Typography, ListItemText, InputLabel, Divider, Button, OutlinedInput, InputAdornment, Link } from '@mui/material'
import { GetServerSideProps } from 'next'
import router from 'next/router'
import React, { useRef, useState } from 'react'
import Layout from '../../layout'
import SearchIcon from '@mui/icons-material/Search'
import supabaseAdmin from '../api/utils/_supabaseClient'
import authRedirectUrl from '../../utils/auth'
import supabasePublic from '../../utils/supabase'
import post from '../../utils/api'

export interface Article {
    pin: number | undefined
    visible: boolean | undefined
    title: string
    time: number
    author: string | undefined
    md: string | undefined
    id: number | undefined
    tags: string[] | undefined
    cover: string | undefined
}

interface EditorProps {
    articles: Article[]
}

const Editor = ({ articles }: EditorProps) => {
    const [articleKeyword, setArticleKeyword] = React.useState('')

    const input = useRef(null)
    const [url, setUrl] = useState('')
    const upload = async () => {
        const file = ((input.current as unknown as HTMLInputElement).files as FileList)[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`
        const image = await supabasePublic.storage
            .from('bed')
            .upload(filePath, file)
        const { publicURL } = supabasePublic
            .storage
            .from('bed')
            .getPublicUrl(image.data?.Key.split('/')[1] as string)
        setUrl(publicURL as string)
    }
    const copyUrl = async () => {
        navigator.clipboard.writeText(url)
    }
    return (
        <Layout title='《新红旗》编辑器'>
            <Typography variant='h5'>
                《新红旗》编辑器
            </Typography>

            <br></br>
            <Button variant='outlined' onClick={async () => {
                const json = await post('/api/article/new', {}, true)
                const { id } = json
                router.push(`/editor/article/${id}`)
            }}>新开一文</Button><br></br>
            <br></br>
            <Typography variant='h6'>
                目录
            </Typography>
            <Typography>
                点击相应文章进入编辑页面。
            </Typography>
            <InputLabel htmlFor='outlined-adornment-amount'>搜索标题关键词</InputLabel>
            <OutlinedInput
                id='outlined-adornment-amount'
                value={articleKeyword}
                onChange={(e) => setArticleKeyword(e.target.value)}
                startAdornment={<InputAdornment position='start'><SearchIcon></SearchIcon></InputAdornment>}
                label='搜索标题关键词'
            />
            <List>
                {
                    articles?.filter(article => `${article.title} （时间：${new Date(article.time).toLocaleDateString()}，ID：${article.id}）`.search(articleKeyword) !== -1).map(article => (
                        <nav key={article.id}>
                            <ListItem>
                                <ListItemButton onClick={() => router.push(`/editor/article/${article.id}`)}>
                                    <ListItemText primary={`${article.title} （时间：${new Date(article.time).toLocaleDateString()}，ID：${article.id}）`} />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </nav>
                    ))
                }
            </List>

            <br></br>
            <Divider sx={{ boxShadow: '2px 2px 2px black' }}></Divider>

            <br></br>
            <Typography variant='h6'>文件存储</Typography>
            <br></br>
            <input type='file' ref={input} style={{
                fontFamily: 'kuaile',
                borderStyle: 'inset',
                width: '100%'
            }}></input>
            <Button variant='contained' onClick={upload}>上传</Button>
            <br></br><br></br>
            <Link href={url} target='_blank' rel='noreferrer' sx={{
                borderStyle: 'outset',
                width: '100%',
                display: 'block',
                overflow: 'scroll'
            }}>{url}<br></br></Link>
            <Button variant='outlined' onClick={copyUrl}>Copy</Button>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    const redirect = await authRedirectUrl(ctx)
    if (redirect) return redirect

    const articles = (await supabaseAdmin
        .from('art')
        .select('id,title,time')
        .order('id', { ascending: false })).data

    return {
        props: {
            articles
        }
    }
}

export default Editor
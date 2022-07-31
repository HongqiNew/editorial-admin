import { getSession } from '@auth0/nextjs-auth0'
import { ListItemButton, List, ListItem, Typography, ListItemText, InputLabel, Divider, Button, OutlinedInput, InputAdornment } from '@mui/material'
import { GetServerSideProps } from 'next'
import router from 'next/router'
import React from 'react'
import InlineText from '../../components/inlinetext'
import Layout from '../../layout'
import { RedirectToLogin } from '../../utils/redirect'
import SearchIcon from '@mui/icons-material/Search';
import supabaseAdmin from '../api/utils/_supabaseClient'

export interface Collection {
    download: string | undefined
    title: string
    time: number
    preview: string | undefined
    articles: string[] | undefined
    id: number | undefined
}

export interface Article {
    title: string
    time: number
    author: string | undefined
    md: string | undefined
    id: number | undefined
    tags: string[] | undefined
}

interface EditorProps {
    collections: Collection[]
    articles: Article[]
}

const Editor = ({ collections, articles }: EditorProps) => {
    const [articleKeyword, setArticleKeyword] = React.useState('');
    return (
        <Layout title='《新红旗》编辑器'>
            <Typography variant="h5">
                《新红旗》编辑器
            </Typography>
            <Typography>
                你可以在<InlineText color='blue'>上半部分</InlineText>新建<InlineText color='blue'>一刊</InlineText>，<InlineText color='green'>下半部分</InlineText>新建<InlineText color='green'>一文</InlineText>。一刊至少由一文组成。目前暂无法发布单独的文章。
            </Typography>

            <br></br>
            <Button variant='outlined' href='/editor/newcol'>新开一刊</Button><br></br>

            <br></br>
            <Typography variant='h6'>
                目录
            </Typography>
            <Typography>
                点击相应刊进入编辑页面。
            </Typography>
            <List>
                <Divider />
                {
                    collections?.map(collection => (
                        <nav key={collection.id}>
                            <ListItem>
                                <ListItemButton onClick={() => router.push(`/editor/collection/${collection.id}`)}>
                                    <ListItemText primary={`${collection.title} （时间：${new Date(collection.time).toLocaleDateString()}，ID：${collection.id}）${collection.id === 0 ? '（置顶）' : ''}`} />
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
            <Button variant='outlined' href='/editor/newart'>新开一文</Button><br></br>

            <br></br>
            <Typography variant='h6'>
                目录
            </Typography>
            <Typography>
                点击相应文章进入编辑页面。
            </Typography>
            <InputLabel htmlFor="outlined-adornment-amount">搜索标题关键词</InputLabel>
            <OutlinedInput
                id="outlined-adornment-amount"
                value={articleKeyword}
                onChange={(e) => setArticleKeyword(e.target.value)}
                startAdornment={<InputAdornment position="start"><SearchIcon></SearchIcon></InputAdornment>}
                label="搜索标题关键词"
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
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    if (!getSession(ctx.req, ctx.res)) {
        return RedirectToLogin;
    }

    const collectionsPromise = supabaseAdmin
        .from('hongqicol')
        .select('id,title,time')
        .order('id', { ascending: false });

    const articlesPromise = supabaseAdmin
        .from('hongqiart')
        .select('id,title,time')
        .order('id', { ascending: false });

    const [collectionsRes, articlesRes] = await Promise.all([collectionsPromise, articlesPromise]);
    const [collections, articles] = [Object.values(collectionsRes.data as any), Object.values(articlesRes.data as any)];

    return {
        props: {
            collections,
            articles
        }
    }
}

export default Editor;

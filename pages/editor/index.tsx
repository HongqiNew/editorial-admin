import { getSession } from '@auth0/nextjs-auth0'
import { ListItemButton, List, ListItem, Typography, ListItemText, Box, Divider, Button } from '@mui/material'
import { GetServerSideProps } from 'next'
import router from 'next/router'
import React from 'react'
import InlineText from '../../components/inlinetext'
import Layout from '../../layout'
import { RedirectToLogin } from '../../utils/redirect'
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
    collections: {
        [id: string]: Collection
    }
    articles: {
        [id: string]: Article
    }
}

const Editor = ({ collections, articles }: EditorProps) => {
    const collectionIds = Object.keys(collections);
    const articleIds = Object.keys(articles);
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
                    collectionIds?.map(id => (
                        <nav key={collections[id].id}>
                            <ListItem>
                                <ListItemButton onClick={() => router.push(`/editor/collection/${collections[id].id}`)}>
                                    <ListItemText primary={`${collections[id].title} （${new Date(collections[id].time).toLocaleDateString()}）${collections[id].id === 0 ? '（置顶）' : ''}`} />
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
                点击相应文进入编辑页面。
            </Typography>
            <List>
                {
                    articleIds?.map(id => (
                        <nav key={articles[id].id}>
                            <ListItem>
                                <ListItemButton onClick={() => router.push(`/editor/article/${articles[id].id}`)}>
                                    <ListItemText primary={`${articles[id].title} （${new Date(articles[id].time).toLocaleDateString()}）`} />
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
    const [collections, articles] = [collectionsRes.data, articlesRes.data];

    return {
        props: {
            collections,
            articles
        }
    }
}

export default Editor;

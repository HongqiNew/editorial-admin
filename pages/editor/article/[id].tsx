import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link } from '@mui/material'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { Article } from '..'
import TextInput from '../../../components/input'
import Layout from '../../../layout'
import post from '../../../utils/api'
import { checkIfEmpty, checkIfURLInvalid, optionally } from '../../../utils/checker'
import authRedirectUrl from '../../../utils/auth'
import supabaseAdmin from '../../api/utils/_supabaseClient'

interface ArticleEditorProps {
    article: Article
}

const ArticleEditor = ({ article }: ArticleEditorProps) => {
    const id = useRouter().query.id as string

    // 对话
    const [open, setOpen] = React.useState(false)
    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleStop = () => {
        setOpen(false)
    }
    const handleDelete = async () => {
        setOpen(false)
        const success = await post('/api/article/delete', { id })
        if (success) {
            window.location.href = '../'
        }
    }

    return (
        <Layout title={`编辑 ${article.title}`}>
            <Typography variant='h5'>
                编辑 {article.title}，ID：{id}
            </Typography>

            <br></br>
            <Typography>
                标题
            </Typography>
            <TextInput
                description='文章标题'
                defaultValue={article.title}
                errorChecker={checkIfEmpty}
                body={{ id }}
                query='title'
                url='/api/article/edit'
            ></TextInput>

            <br></br>
            <Typography>
                时间
            </Typography>
            <TextInput
                description='格式：YYYY/MM/DD HH:MM:SS'
                defaultValue={new Date(article.time).toLocaleString()}
                errorChecker={checkIfEmpty}
                body={{ id }}
                query='time'
                url='/api/article/edit'
            ></TextInput>

            <br></br>
            <Typography>
                作者
            </Typography>
            <TextInput
                description='纯文本'
                defaultValue={article.author}
                errorChecker={checkIfEmpty}
                body={{ id }}
                query='author'
                url='/api/article/edit'
            ></TextInput>

            <br></br>
            <Typography>
                封面
            </Typography>
            <TextInput
                description='填完整 URL。'
                body={{ id }}
                defaultValue={article.cover}
                errorChecker={value => optionally(value, checkIfURLInvalid)}
                query='cover'
                url='/api/article/edit'
                multiline
            ></TextInput>

            <br></br>
            <Typography>
                标签
            </Typography>
            <TextInput
                description={
                    <>
                        一行写一个。
                    </>
                }
                defaultValue={article.tags?.join('\n')}
                body={{ id }}
                query='tags'
                url='/api/article/edit'
                multiline
            ></TextInput>

            <br></br>
            <Typography>
                置顶优先级
            </Typography>
            <TextInput
                description='正整数（非正数或留空不置顶）。越小的数越先轮播。最先展示的文章可填 1。可理解为轮播的次序，即第几张，但并不严格要求递增 1。'
                body={{ id }}
                defaultValue={article.pin}
                errorChecker={value => optionally(value, val => val < 1)}
                query='pin'
                url='/api/article/edit'
            ></TextInput>

            <br></br>
            <Typography>
                显示于首页
            </Typography>
            <TextInput
                description='选填 true / false。默认不显示，但是依然可以通过访问 /art/[id] 预览。'
                body={{ id }}
                defaultValue={article.visible}
                errorChecker={val => !['true', 'false'].includes(val)}
                query='visible'
                url='/api/article/edit'
            ></TextInput>

            <br></br>
            <Typography>
                正文
            </Typography>
            <TextInput
                description={
                    <>
                        请使用 <Link href='https://markdown.com.cn/' target='_blank' rel='noreferrer'>Markdown</Link> 格式。
                    </>
                }
                defaultValue={article.md}
                errorChecker={checkIfEmpty}
                body={{ id }}
                query='md'
                url='/api/article/edit'
                multiline
            ></TextInput>

            <br></br>
            <Button variant='outlined' color='error' onClick={handleClickOpen}>删除本文</Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    你正在删除本文
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        注意！你正在执行删除操作。如果按下确定，就没有回头路了。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStop}>停止删除</Button>
                    <Button onClick={handleDelete} autoFocus color='error'>
                        删除
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout >
    )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    const redirect = await authRedirectUrl(ctx)
    if (redirect) return redirect

    const id = ctx.query.id as string
    const articleData = await supabaseAdmin
        .from('art')
        .select()
        .match({ id })
        .single()
    return {
        props: {
            article: articleData.data
        }
    }
}

export default ArticleEditor
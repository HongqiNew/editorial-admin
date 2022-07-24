import { getSession } from '@auth0/nextjs-auth0';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link } from '@mui/material'
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Article } from '..';
import TextInput from '../../../components/input';
import Layout from '../../../layout';
import post from '../../../utils/api';
import { checkIfEmpty } from '../../../utils/checker';
import { RedirectToLogin } from '../../../utils/redirect';
import supabaseAdmin from '../../api/utils/_supabaseClient';

interface ArticleEditorProps {
    article: Article
}

const ArticleEditor = ({ article }: ArticleEditorProps) => {
    const id = useRouter().query.id as string;

    // 对话
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleStop = () => {
        setOpen(false);
    };
    const handleDelete = async () => {
        setOpen(false);
        const success = await post('/api/article/delete', { id });
        if (success) {
            window.location.href = '../';
        }
    };

    return (
        <Layout title={`编辑 ${article.title}`}>
            <Typography variant="h5">
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
            <Button variant='outlined' color="error" onClick={handleClickOpen}>删除本文</Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    你正在删除本文
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
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
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    if (!getSession(ctx.req, ctx.res)) {
        return RedirectToLogin;
    }

    const id = ctx.query.id as string;
    const articleData = await supabaseAdmin
        .from('hongqiart')
        .select()
        .match({ id })
        .single();
    return {
        props: {
            article: articleData.data
        }
    };
}

export default ArticleEditor;
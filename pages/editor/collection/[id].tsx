import { getSession } from '@auth0/nextjs-auth0';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Collection } from '..';
import TextInput from '../../../components/input';
import Layout from '../../../layout';
import post from '../../../utils/api';
import { checkIfEmpty, checkIfURLInvalid, optionally } from '../../../utils/checker';
import { RedirectToLogin } from '../../../utils/redirect';
import supabaseAdmin from '../../api/utils/_supabaseClient';

type CollectionEditorProps = {
    collection: Collection
}

const CollectionEditor = ({ collection }: CollectionEditorProps) => {
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
        const success = await post('/api/collection/delete', { id });
        if (success) {
            window.location.href = '../';
        }
    };

    return (
        <Layout title={`编辑 ${collection.title}`}>
            <Typography variant="h5">
                编辑 {collection.title}
            </Typography>

            <br></br>
            <Typography>
                标题
            </Typography>
            <TextInput
                description='刊物标题'
                defaultValue={collection.title}
                errorChecker={checkIfEmpty}
                body={{ id }}
                query='title'
                url='/api/collection/edit'
            ></TextInput>

            <br></br>
            <Typography>
                时间
            </Typography>
            <TextInput
                description='格式：YYYY/MM/DD HH:MM:SS'
                defaultValue={new Date(collection.time).toLocaleString()}
                errorChecker={checkIfEmpty}
                body={{ id }}
                query='time'
                url='/api/collection/edit'
            ></TextInput>

            <br></br>
            <Typography>
                文章（若不为空则自动发布）
            </Typography>
            <TextInput
                description={
                    <>
                        一行填写一篇文章的 ID。
                    </>
                }
                defaultValue={collection.articles?.join('\n')}
                errorChecker={checkIfEmpty}
                body={{ id }}
                query='articles'
                url='/api/collection/edit'
                multiline
            ></TextInput>

            <br></br>
            <Typography>
                预览图
            </Typography>
            <TextInput
                description='填完整 URL。'
                defaultValue={collection.preview}
                errorChecker={checkIfURLInvalid}
                body={{ id }}
                query='preview'
                url='/api/collection/edit'
            ></TextInput>

            <br></br>
            <Typography>
                下载链接（选填）
            </Typography>
            <TextInput
                description='填完整 URL。'
                defaultValue={collection.download}
                errorChecker={value => optionally(value, checkIfURLInvalid)}
                body={{ id }}
                query='download'
                url='/api/collection/edit'
            ></TextInput>

            <br></br>
            <Button variant='outlined' color="error" onClick={handleClickOpen} disabled={!parseInt(id)}>{parseInt(id) ? '删除本刊' : '因为本刊被置顶，故无法删除。'}</Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    你正在删除本刊
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
    const collectionData = await supabaseAdmin
        .from('hongqicol')
        .select()
        .match({ id })
        .single();
    return {
        props: {
            collection: collectionData.data
        }
    };
}

export default CollectionEditor;
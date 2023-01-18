import Head from 'next/head'

type LayoutHeadProps = {
    title: string
}

const LayoutHead = ({ title }: LayoutHeadProps) => {
    return (
        <Head>
            <title>
                {`${title} | 新红旗（后台）`}
            </title>
            <meta name='application-name' content='《新红旗》社论' />
            <meta name='apple-mobile-web-app-capable' content='yes' />
            <meta name='apple-mobile-web-app-status-bar-style' content='default' />
            <meta name='apple-mobile-web-app-title' content='《新红旗》' />
            <meta name='format-detection' content='telephone=no' />
            <meta name='mobile-web-app-capable' content='yes' />
            <meta name='msapplication-config' content='/browserconfig.xml' />
            <meta name='msapplication-TileColor' content='#2B5797' />
            <meta name='msapplication-tap-highlight' content='no' />
            <meta name='theme-color' content='#000000' />
            <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
            <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
            <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
            <link rel='manifest' href='/manifest.json' />
            <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#5bbad5' />
            <link rel='shortcut icon' href='/favicon.ico' />
        </Head>
    )
}

export default LayoutHead

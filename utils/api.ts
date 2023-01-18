// 返回是否成功
const post = async (url: string, data?: JSON | Object, returnJSON?: boolean) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const json = await res.json().catch(() => {
        return false
    })
    return returnJSON ? json : json.success
}

// 返回 JSON
export const get = async (url: string, data?: JSON | Object): Promise<any> => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await res.json()
}

export default post

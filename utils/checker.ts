const checkIfURLInvalid = (URL: string) => {
    const pattern = new RegExp('^((ft|htt)ps?:\\/\\/)' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?' + // port
        '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
        '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !pattern.test(URL);
}

const checkIfSubdomainInvalid = (value: string) => {
    return Boolean(
        value.length > 10 ||
        value.length < 1 ||
        value.match(/[^a-zA-Z0-9-]/)
    );
}

const checkIfEmpty = (value: string) => {
    return value === '';
}

const optionally = (value: string, checker: (value: any) => boolean) => {
    return value !== '' && checker(value);
}

export { checkIfURLInvalid, checkIfSubdomainInvalid, checkIfEmpty, optionally };

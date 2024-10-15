export function getB64Img(file) {
    return new Promise((resolve) => {
        var reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result)
        }
        reader.readAsDataURL(file)
    })
}
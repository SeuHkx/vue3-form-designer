export const generateRandomString = ()=> {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const indices = new Set<number>();
    while (indices.size < 3) {
        indices.add(Math.floor(Math.random() * 7));
    }
    Array.from(indices).forEach((index:number) => {
        result = result.slice(0, index) + result.charAt(index).toUpperCase() + result.slice(index + 1);
    });
    return result;
}

export const initGetDataExpressionValue = (str:any)=>{
    if(typeof str ==='undefined' || str === true)return '';
    const regex = /{{(.*?)}}/;
    const match = str.match(regex);
    if (match) {
        return match[1];
    }else{
        return str;
    }
}
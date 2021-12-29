const url = "http://api.coincap.io/v2";

const getAssets = async () => {
try {
    const req = await fetch(`${url}/assets?limit=20`);
    const res = await req.json();
    return res.data;    
} catch (error) {
    console.error(error);
    throw new Error(error);
}    
};
export const getAsset = async (coin) => {
    console.log("este es el id",coin)
    try {
        const req = await fetch(`${url}/assets/${coin}`);
        const res =await req.json();
        return res.data;    
    } catch (error) {
        console.error(error);
    }
        
};

export const getAssetHistory = async (coin) => {
    try {
        const now = new Date();
        const end = now.getTime();
        now.setDate(now.getDate() - 1);
        const start = now.getTime();
        const req = await fetch(`${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`);
        const res = await req.json();
        
        return res.data;
        
    } catch (error) {
        console.error(error);  
    }
};
export const getMarkets = async (coin) => {
    try {
        const req = await fetch(`${url}/assets/${coin}/markets?limit=5`)
        const res = await req.json();
        console.log("esto es markets",res.data);
        return res.data
    } catch (error) {
        console.log(error)
    }
};

export const getExchanges = async (id) => {
    try {
        const req = await fetch(`${url}/exchanges/${id}`);
        const res= await req.json();
        return res.data
    } catch (error) {
        console.log(error)
    }
}
export default getAssets;
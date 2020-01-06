
async function mm () : Promise<any>
{
    return {status: "ff"}
} 



let t = new Promise((resolve, reject)=>{
    
    if(1)
    {
        resolve({status: "ff"})

    }
    else
    {
        reject({ff : "ff"});
    }
})

t.then((v)=>{
    console.log(v)
})
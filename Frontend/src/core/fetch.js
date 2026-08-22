export default async function falseetch(...args){
    console.warn("Fetch function is already depricated");

    return {
        status: 500,
        success: false,
        message: "function already depricated",
    }
}
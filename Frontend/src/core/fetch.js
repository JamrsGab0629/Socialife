export default async function Fetch( url ){
    try {
        const response = await fetch(url);
        // console.log("debug.fetch", response);

        if (!response.ok) throw new Error("Feching failed");
        
        const data = await response.json();
        // console.log("debug.fetch", data);
        return data;
    } catch (error) {
        console.error(error);
        return;
    }
}

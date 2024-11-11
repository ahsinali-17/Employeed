import supabaseClient,{supabaseUrl} from "@/utils/supabase";

export async function getCompanies(token){
    const supabase = await supabaseClient(token);
    const {data,error} = await supabase.from('companies').select('*');
    if (error){
        console.error("error fetching companies: " + error)
        return null
    }
    return data;
}

export async function addCompanies(token,_,compData){
    const supabase = await supabaseClient(token);
    const filename = `logo-${Math.floor(Math.random() * 999999)}-${compData.name}`;
    const {error: storgeError} = await supabase.storage.from('company-logo').upload(filename,compData.logo)
    if (storgeError) {
        console.log("error storing resume: " + storgeError)
        return null
    }
    let logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${filename}`;
    const {data,error} = await supabase.from('companies').insert([{name:compData.name,logo_url}]).select(); 
    if (error) {
        console.log("error adding company: " + error)
        return null
    }
    return data;
}
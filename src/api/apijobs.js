import supabaseClient from "@/utils/supabase";

export async function getJobs(token,{location,company_id,searchQuery}){
    const supabase = await supabaseClient(token);

    //postgreSql will apply implicit join based on foriegn key relationship
    let query = supabase.from('jobs').select('*,company: companies(name,logo_url),saved: saved-jobs(id)');

    //filter queries
    if(location) query = query.eq("location",`${location}`);            
    if(company_id) query = query.eq("company_id",company_id);
    if(searchQuery) query = query.ilike("title",`%${searchQuery}%`);
    
    const {data,error} = await query;
    if (error) {
        console.log("error fetching jobs: " + error)
        return null
    }
    return data;
} 

export async function saveJob(token,{isAlreadySaved},saveData){
    const supabase = await supabaseClient(token);
     
    if(isAlreadySaved){
       const {data,error:deleteError} = await supabase.from('saved-jobs').delete().eq('job_id',saveData.job_id);
       if(deleteError){
        console.log("error fetching jobs: " + deleteError)
        return null
       }
       return data;
    }
    
    else{
        const {data,error:saveError} = await supabase.from('saved-jobs').insert([saveData]).select(); //returns modified row only
        if(saveError){
            console.log("error fetching jobs: " + saveError)
            return saveError
        }
        return data;
    }
} 

export async function getJob(token,{job_id}){
    const supabase = await supabaseClient(token);
    const {data,error} = await supabase.from('jobs').select('*,company: companies(name,logo_url),applications:applications(*)').eq('id',job_id).single(); //single() returns data in object format instead of a single element array
    if (error) {
        console.log("error fetching job: " + error)
        return null
    }
    return data;
}

export async function updateJobStatus(token,{job_id},isOpen){
    const supabase = await supabaseClient(token);
    const {data,error} = await supabase.from('jobs').update({isOpen}).eq('id',job_id).single(); 
    if (error) {
        console.log("error updating job: " + error)
        return null
    }
    return data;
}

export async function insertJob(token,_ ,jobData){
    const supabase = await supabaseClient(token);
    const {data,error} = await supabase.from('jobs').insert([jobData]).select(); 
    if (error) {
        console.log("error inserting job: " + error)
        return null
    }
    return data;
}
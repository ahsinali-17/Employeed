import supabaseClient,{supabaseUrl } from '@/utils/supabase';
export async function insertApplication(token,_,applicationData){
    const supabase = await supabaseClient(token);
    const filename = `resume-${Math.floor(Math.random() * 999999)}-${applicationData.candidate_id}`;
    const {error: storgeError} = await supabase.storage.from('resumes').upload(filename,applicationData.resume)
    if (storgeError) {
        console.log("error storing resume: " + storgeError)
        return null
    }
    let resume = `${supabaseUrl}/storage/v1/object/public/resumes/${filename}`;
    const {data,error} = await supabase.from('applications').insert([{...applicationData,resume}]).select(); 
    if (error) {
        console.log("error inserting application: " + error)
        return null
    }
    return data;
}

export async function updateApplication(token,{job_id},status){
    const supabase = await supabaseClient(token);
    const {data,error} = await supabase.from('applications').update({status}).eq('job_id',job_id).select(); 
    if (error || data.length) {
        console.log("error updating application status: " + error)
        return null
    }
    return data;
}

export async function getApplications(token){
    const supabase = await supabaseClient(token);
    const {data,error} = await supabase.from('applications').select('*,job:jobs(*,company:companies(name,logo_url))'); 
    if (error) {
        console.log("error fetching applications: " + error)
        return null
    }
    return data;
}

export async function deleteApplication(token,_,appId){
    const supabase = await supabaseClient(token);
    const {data,error} = await supabase.from('applications').delete().eq('id',appId).select(); 
    if (error) {
        console.log("error deleting application: " + error)
        return null
    }
    return data;
}
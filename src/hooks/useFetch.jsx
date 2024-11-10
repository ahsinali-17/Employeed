import React,{useState} from 'react';
import {useSession} from '@clerk/clerk-react';

const useFetch = (cb, options = {})=>{
  const {session} = useSession();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fn = async(...args)=>{
        setLoading(true);
        try{
        const token = await session.getToken({template: "supabase"});
        const response = await cb(token,options,...args)
        setData(response);
    }
    catch(error){
        setError(error);
    }
    finally{
        setLoading(false);
    }
    }
    return {data,loading,error,fn}
}
export default useFetch;
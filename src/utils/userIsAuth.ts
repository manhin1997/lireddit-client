import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const userIsAuth = () => {
    const [{data, fetching}] = useMeQuery();
    const router = useRouter();
    useEffect(() => {
        console.log(router);
        if(!fetching && !data?.me){
            router.replace('/login?next='+router.pathname);
        }
    }, [fetching, data, router])
}
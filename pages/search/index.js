import React from 'react'
import {useRouter} from "next/router";
import SearchCombos from "../../components/search/SearchCombos";
import SearchInventories from "../../components/search/SearchInventories";

const SearchPage = () => {
    const router = useRouter();
    const {type, keyword} = router.query;

    if (type === 'combo') {
        return <SearchCombos keyword={keyword}/>
    } else {
        return <SearchInventories keyword={keyword}/>
    }
}

export default SearchPage;
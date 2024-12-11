import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const Paginate = () =>{
  return(
    <>
      <Stack spacing={2}>
        <Pagination count={6} variant="outlined" shape="rounded" />
      </Stack>
    </>
  )
}
export default Paginate
import { useEffect, useState } from "react";
import axios from 'axios';

const useFetch = (url: string) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      axios.get(url)
        .then(function (response) {
          setData(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
    }

    fetchData()
  }, [url]);
  return data;
};

export { useFetch }
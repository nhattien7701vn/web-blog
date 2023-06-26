import axiosClient from "./axiosClient.mjs";
export const postApi = {
  getAll: (params) => {
    const url = "/posts";
    return axiosClient.get(url, { params });
  },
  create:(data)=>{
    const url = "/posts";
    return axiosClient.post(url, data);
  },
  update:(id, data)=>{
    const url = `/posts/${id}`;
    return axiosClient.patch(url, data);
  },
  delete:(id)=>{
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  }
};

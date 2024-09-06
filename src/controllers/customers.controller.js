import ApiClient from "../helpers/ApiClient";
import useSWR from "swr";

const fetcher = (url) => ApiClient.get(url).then((res) => res.data);

export function useCustomers({ page = 1, perPage = 10, filter = "" }) {
  const APIURL = `/customers?sort=created_at&page=${page}&filter=${filter}&perPage=${perPage}`;
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}

export async function searchCustomer(search) {
  try {
    const response = await ApiClient.get(`/customers/${search}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function addCustomer(phone, name, email, birthDate, gender , notes) {
  try {
    const response = await ApiClient.post("/customers/add", {
      phone,
      name,
      email,
      birthDate,
      gender,
      notes
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function updateCustomer(phone, name, email, birthDate, gender , notes) {
  try {
    const response = await ApiClient.post(`/customers/${phone}/update`, {
      name,
      email,
      birthDate,
      gender,
      notes
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function deleteCustomer(id) {
  try {
    const response = await ApiClient.delete(`/customers/${id}/delete`)
    return response;
  } catch (error) {
    throw error;
  }
};

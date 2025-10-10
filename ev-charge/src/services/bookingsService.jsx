import API from "../api/api";

export const createBooking = async (payload) => {
  const res = await API.post("/api/bookings", payload);
  return res.data;
};

export const updateBooking = async (payload) => {
  const res = await API.patch("/api/bookings", payload);
  return res.data;
};

export const deleteBooking = async (id) => {
  const res = await API.delete(`/api/bookings/${id}`);
  return res.data;
};

export const getBooking = async (id) => {
  const res = await API.get(`/api/bookings/${id}`);
  return res.data;
};

export const getMyBookings = async (ownerNic) => {
  const res = await API.get(`/api/bookings/mine/${ownerNic}`);
  return res.data;
};

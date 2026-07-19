import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

export default api;

export const CATEGORY_COLORS = {
  CEMENT: { bg: "#EAE8E3", text: "#4E6E7E", label: "Cement" },
  RET: { bg: "#F1E7CE", text: "#9A7519", label: "Ret (Sand)" },
  BAJRI: { bg: "#F0E1D6", text: "#B9502F", label: "Bajri" },
  BRICK: { bg: "#F3DCD3", text: "#A13F26", label: "Bricks" },
  STEEL: { bg: "#E2E7E9", text: "#37515E", label: "Steel" },
  OTHER: { bg: "#EAEAEA", text: "#555555", label: "Other" },
};

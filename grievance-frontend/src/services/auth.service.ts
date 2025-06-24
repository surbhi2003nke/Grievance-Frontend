export async function getAllAdmins() {
  const response = await fetch("https://grievanceportal.vercel.app/api/v1/super-admin/admins", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch admins");
  }
  return response.json();
}

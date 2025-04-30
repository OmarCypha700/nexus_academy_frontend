// "use server";

// import { cookies } from "next/headers";

// // Function to check if user is authenticated
// export async function getUser() {
//   const token = cookies().get("access_token")?.value; // Get token from cookies

//   if (!token) return null; // If no token, user is not logged in

//   try {
//     // Fetch user data from Django API using token
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!response.ok) return null;

//     return await response.json();
//   } catch (error) {
//     return null;
//   }
// }

export async function loadDbProfile({ client, currentUser, auth, setDbUser }) {
  if (!currentUser?.email) return null;
  try {
    const response = await client.get(`/user/${encodeURIComponent(currentUser.email)}`);
    if (auth.currentUser?.uid === currentUser.uid) setDbUser(response.data);
    return response.data;
  } catch {
    // Backend availability/authorization is separate from Firebase authentication.
    if (auth.currentUser?.uid === currentUser.uid) setDbUser(null);
    return null;
  }
}

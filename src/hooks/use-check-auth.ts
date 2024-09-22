export const useCheckAuth = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URI}/api/auth/check_auth`, {
      method: 'GET',
      credentials: 'include'
    });

    const data = await response.json();
    return {
      success: data?.success || false,
      name: data?.name || ''
    };
  } catch (error) {
    console.log("Login check failed", error);
  }
}

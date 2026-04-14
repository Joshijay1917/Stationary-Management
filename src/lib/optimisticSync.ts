export const withOptimisticSync = async (
    apiPromise: Promise<Response>,
    rollback: () => void,
    onSuccess?: (data: any) => void
) => {
    try {
        // 1. Wait for the API call to finish
        const response = await apiPromise;

        // 2. If the backend throws an error (like a 500 or 404), trigger the catch block
        if (!response.ok) throw new Error("API request failed");

        // 3. If the API returns data (like an ID for a new item), pass it to the success function
        if (onSuccess) {
            const data = await response.json();
            onSuccess(data);
        }
    } catch (error) {
        console.error("Sync Error:", error);
        // 4. If anything fails, run the rollback function and warn the user
        rollback();
        alert("Sync failed! Changes reverted. Please check your internet connection.");
    }
};
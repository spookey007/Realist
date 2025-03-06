export const handleAsyncAction = async (asyncFunction, setLoading) => {
  if (typeof asyncFunction !== "function") {
    console.error("❌ handleAsyncAction error: asyncFunction is not a function", asyncFunction);
    return;
  }

  try {
    setLoading(true); // Disable button
    await asyncFunction(); // Execute async function
  } catch (error) {
    console.error("❌ Error in async function:", error);
  } finally {
    setLoading(false); // Enable button after execution
  }
};

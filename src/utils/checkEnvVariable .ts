// Function to check if an environment variable is defined and return its value
const checkEnvVariable = (variableName: string) => {
  // Get the value of the environment variable
  const variable = process.env[variableName];

  // Check if the variable is undefined or empty
  if (!variable) {
    // If it's not defined or empty, throw an error
    throw new Error(`Environment variable ${variableName} is not defined`);
  }

  // Return the value of the environment variable
  return variable;
};

// Export the checkEnvVariable function
export default checkEnvVariable;

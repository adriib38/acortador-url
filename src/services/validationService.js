const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
  return {
    "valid": usernameRegex.test(username),
    "message": usernameRegex.test(username) ? "" : "Invalid username. Must be 3-20 characters and can only contain letters, numbers, underscores, and periods."
  };
};

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const validatePassword = (password) => {
  const passwordRegex = 
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[\s\S]{8,}$/;

    return {
        "valid": passwordRegex.test(password),
        "message": passwordRegex.test(password) ? "" : "Invalid password. Must be 8 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character."
    };
}


module.exports = {
  validateUsername,
  validatePassword,
};
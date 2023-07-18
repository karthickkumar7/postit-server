const verifyUsername = (username) => {
    if (!username || (username && username.length < 3)) return false;
    return true;
};

const verifyPassword = (password) => {
    if (
        !password ||
        (password && password.length < 5) ||
        (password && password.length > 20)
    )
        return false;
    return true;
};

const verifyEmail = (email) => {
    const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email.match(re);
};

const verifyDesc = (desc) => {
    if (!desc || (desc && desc.length < 10) || (desc && desc.length > 1000))
        return false;
    return true;
};

module.exports = {
    verifyPassword,
    verifyUsername,
    verifyEmail,
    verifyDesc,
};

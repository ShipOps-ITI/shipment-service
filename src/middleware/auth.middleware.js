const authenticate = (req, res, next) => {

    // Temporary middleware
    // Allows all requests during development.

    next();

};

export default authenticate;
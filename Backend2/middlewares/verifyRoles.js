const verifyRoles = (...allowedRoles) => {
    const normalizedRole = new Set(
        allowedRoles.map(role => role.toLowerCase())
    );

    return (req, res, next) => {
        const userRole = req.role;
        if(!userRole) {
            return res.status(401).json({ error: "Authentication required" });
        }

        if(typeof userRole !== "string") {
            return res.status(403).json({ error: "User role is missing" });
        }

        if(!normalizedRole.has(userRole.toLocaleLowerCase())) {
            return res.status(403).json({ error: "Inusfficient permissions" });
        }
        
        next();
    }
};

module.exports = { verifyRoles };
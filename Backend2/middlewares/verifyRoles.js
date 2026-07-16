let roleToIdHierarchy = {
    user: 1,
    admin: 2,
};


const verifyRoles = (allowedRole) => {
    return (req, res, next) => {
        if (!req?.role) return res.sendStatus(401); // The role must be put in the token, so each time there is a request, it gets decoded and we get the user role

        const userRole = req.role.toLowerCase();
        const userRank = Number(roleToIdHierarchy[userRole] || 0);

        const allowedRank = Number(roleToIdHierarchy[allowedRole.toLowerCase()] || 0);

        // Hierarchical access: higher roles inherit lower role permissions
        const isAllowed = userRank >= allowedRank;

        if (!isAllowed) return res.sendStatus(403);

        next();
    };
};

module.exports = { verifyRoles };
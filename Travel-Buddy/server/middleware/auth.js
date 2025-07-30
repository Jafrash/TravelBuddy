"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.isAuthenticated = void 0;
exports.isAuthenticatedRequest = isAuthenticatedRequest;
exports.getAuthenticatedUser = getAuthenticatedUser;
// Middleware to check if user is authenticated
var isAuthenticated = function (req, res, next) {
    if (isAuthenticatedRequest(req)) {
        return next();
    }
    res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to access this resource'
    });
};
exports.isAuthenticated = isAuthenticated;
// Type guard to check if request is authenticated
function isAuthenticatedRequest(req) {
    return req.isAuthenticated !== undefined && req.isAuthenticated();
}
// Utility function to get the authenticated user (safely)
function getAuthenticatedUser(req) {
    return isAuthenticatedRequest(req) ? req.user : null;
}
// Global error handler
var errorHandler = function (err, req, res, next) {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};
exports.errorHandler = errorHandler;

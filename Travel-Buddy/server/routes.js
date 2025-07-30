"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
var http_1 = require("http");
var storage_1 = require("./storage");
var auth_1 = require("./auth");
var schema_1 = require("@shared/schema");
var zod_1 = require("zod");
var path_1 = require("path");
var url_1 = require("url");
var ws_1 = require("ws");
var places_1 = require("./services/places");
var axios_1 = require("axios");
var __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer, wss, clients;
        var _this = this;
        return __generator(this, function (_a) {
            // Simple API documentation endpoint for developers
            app.get("/api/docs", function (req, res) {
                res.json({
                    message: "TravelBuddy API Documentation",
                    version: "1.0.0",
                    endpoints: [
                        { path: "/api/health", method: "GET", description: "API health check" },
                        { path: "/api/agents", method: "GET", description: "Get all travel agents" },
                        { path: "/api/user", method: "GET", description: "Get current authenticated user" },
                        { path: "/api/trip-preferences", method: "GET", description: "Get trip preferences" },
                        { path: "/api/itineraries", method: "GET", description: "Get itineraries" }
                    ]
                });
            });
            // sets up /api/register, /api/login, /api/logout, /api/user
            (0, auth_1.setupAuth)(app);
            // Simple health check endpoint
            app.get("/api/health", function (req, res) {
                res.json({ status: "ok", timestamp: new Date().toISOString() });
            });
            // Places API - Handle both GET and POST requests
            app.all("/api/places/search", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var query, city, cityInfo, serviceError_1, error_1, errorResponse;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 5, , 6]);
                            query = void 0, city = void 0;
                            // Handle both GET and POST requests
                            if (req.method === 'GET') {
                                query = req.query.q;
                                city = req.query.city || req.query.q; // For backward compatibility
                            }
                            else if (req.method === 'POST') {
                                query = req.body.query;
                                city = req.body.city || req.body.query;
                            }
                            else {
                                return [2 /*return*/, res.status(405).json({
                                        success: false,
                                        message: 'Method not allowed. Use GET or POST.'
                                    })];
                            }
                            if (!city || typeof city !== 'string') {
                                return [2 /*return*/, res.status(400).json({
                                        success: false,
                                        message: 'City name is required',
                                        received: { query: query, city: city }
                                    })];
                            }
                            console.log("[API] Searching for places in: ".concat(city));
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, places_1.placesService.getCityPlaces(city)];
                        case 2:
                            cityInfo = _d.sent();
                            if (!cityInfo) {
                                console.log("[API] No places found for: ".concat(city));
                                return [2 /*return*/, res.status(200).json({
                                        success: true,
                                        message: 'No places found for the specified location',
                                        data: {
                                            name: city.split(',')[0],
                                            description: "Explore the beautiful city of ".concat(city.split(',')[0], ", known for its rich culture, history, and attractions."),
                                            bestTimeToVisit: 'The best time to visit is during spring (March to May) and fall (September to November) when the weather is pleasant.',
                                            places: []
                                        }
                                    })];
                            }
                            console.log("[API] Found ".concat(cityInfo.places.length, " places for: ").concat(city));
                            res.json({
                                success: true,
                                data: cityInfo
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            serviceError_1 = _d.sent();
                            console.error('[API] Service error:', serviceError_1);
                            throw serviceError_1; // This will be caught by the outer catch
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_1 = _d.sent();
                            console.error('[API] Error in places search:', error_1);
                            errorResponse = {
                                success: false,
                                message: 'Failed to search places',
                                details: {}
                            };
                            if (error_1 instanceof Error) {
                                errorResponse.details.message = error_1.message;
                                errorResponse.details.name = error_1.name;
                                // Check if it's an Axios error
                                if (axios_1.default.isAxiosError(error_1)) {
                                    errorResponse.details.status = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status;
                                    errorResponse.details.statusText = (_b = error_1.response) === null || _b === void 0 ? void 0 : _b.statusText;
                                    errorResponse.details.data = (_c = error_1.response) === null || _c === void 0 ? void 0 : _c.data;
                                }
                            }
                            res.status(500).json(errorResponse);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            // API routes
            // Agent profiles
            app.get("/api/agents", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var agents, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getAgents()];
                        case 1:
                            agents = _a.sent();
                            res.json(agents);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch agents" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/agents/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, agent, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getAgentById(id)];
                        case 1:
                            agent = _a.sent();
                            if (!agent) {
                                return [2 /*return*/, res.status(404).json({ message: "Agent not found" })];
                            }
                            res.json(agent);
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch agent" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/agents", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var data, agentProfile, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!req.isAuthenticated() || !req.user) {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            if (req.user.role !== "agent") {
                                return [2 /*return*/, res.status(403).json({ message: "Forbidden: Agent role required" })];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            data = schema_1.insertAgentProfileSchema.parse(req.body);
                            return [4 /*yield*/, storage_1.storage.createAgentProfile(__assign(__assign({}, data), { userId: parseInt(req.user.id, 10) }))];
                        case 2:
                            agentProfile = _a.sent();
                            res.status(201).json(agentProfile);
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            if (error_4 instanceof zod_1.z.ZodError) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid agent profile data", errors: error_4.errors })];
                            }
                            res.status(500).json({ message: "Failed to create agent profile" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Trip preferences
            app.post("/api/trip-preferences", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var data, tripPreference, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!req.isAuthenticated() || !req.user || req.user.role !== "traveler") {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            data = schema_1.insertTripPreferenceSchema.parse(req.body);
                            return [4 /*yield*/, storage_1.storage.createTripPreference(__assign(__assign({}, data), { travelerId: parseInt(req.user.id, 10) }))];
                        case 2:
                            tripPreference = _a.sent();
                            res.status(201).json(tripPreference);
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            if (error_5 instanceof zod_1.z.ZodError) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid trip preference data", errors: error_5.errors })];
                            }
                            res.status(500).json({ message: "Failed to create trip preference" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/trip-preferences", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var tripPreferences, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!req.isAuthenticated() || !req.user) {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            tripPreferences = void 0;
                            if (!(req.user.role === "traveler")) return [3 /*break*/, 3];
                            return [4 /*yield*/, storage_1.storage.getTripPreferencesByTravelerId(parseInt(req.user.id, 10))];
                        case 2:
                            tripPreferences = _a.sent();
                            return [3 /*break*/, 5];
                        case 3:
                            if (!(req.user.role === "agent")) return [3 /*break*/, 5];
                            return [4 /*yield*/, storage_1.storage.getAllTripPreferences()];
                        case 4:
                            tripPreferences = _a.sent();
                            _a.label = 5;
                        case 5:
                            res.json(tripPreferences);
                            return [3 /*break*/, 7];
                        case 6:
                            error_6 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch trip preferences" });
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
            // Itineraries
            app.post("/api/itineraries", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var data, itinerary, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!req.isAuthenticated() || req.user.role !== "agent") {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            data = schema_1.insertItinerarySchema.parse(req.body);
                            return [4 /*yield*/, storage_1.storage.createItinerary(__assign(__assign({}, data), { agentId: parseInt(req.user.id, 10) }))];
                        case 2:
                            itinerary = _a.sent();
                            res.status(201).json(itinerary);
                            return [3 /*break*/, 4];
                        case 3:
                            error_7 = _a.sent();
                            if (error_7 instanceof zod_1.z.ZodError) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid itinerary data", errors: error_7.errors })];
                            }
                            res.status(500).json({ message: "Failed to create itinerary" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/itineraries", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var itineraries, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!req.isAuthenticated()) {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            itineraries = void 0;
                            if (!(req.user.role === "traveler")) return [3 /*break*/, 3];
                            return [4 /*yield*/, storage_1.storage.getItinerariesByTravelerId(parseInt(req.user.id, 10))];
                        case 2:
                            itineraries = _a.sent();
                            return [3 /*break*/, 5];
                        case 3:
                            if (!(req.user.role === "agent")) return [3 /*break*/, 5];
                            return [4 /*yield*/, storage_1.storage.getItinerariesByAgentId(parseInt(req.user.id, 10))];
                        case 4:
                            itineraries = _a.sent();
                            _a.label = 5;
                        case 5:
                            res.json(itineraries);
                            return [3 /*break*/, 7];
                        case 6:
                            error_8 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch itineraries" });
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/itineraries/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, itinerary, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!req.isAuthenticated()) {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            id = parseInt(req.params.id, 10);
                            if (isNaN(id)) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid itinerary ID" })];
                            }
                            return [4 /*yield*/, storage_1.storage.getItineraryById(id)];
                        case 2:
                            itinerary = _a.sent();
                            if (!itinerary) {
                                return [2 /*return*/, res.status(404).json({ message: "Itinerary not found" })];
                            }
                            // Check if the user is authorized to access this itinerary
                            if (req.user.role === "traveler" && itinerary.travelerId !== parseInt(req.user.id, 10)) {
                                return [2 /*return*/, res.status(403).json({ message: "Forbidden" })];
                            }
                            if (req.user.role === "agent" && itinerary.agentId !== parseInt(req.user.id, 10)) {
                                return [2 /*return*/, res.status(403).json({ message: "Forbidden" })];
                            }
                            return [2 /*return*/, res.json(itinerary)];
                        case 3:
                            error_9 = _a.sent();
                            console.error('Error fetching itinerary:', error_9);
                            return [2 /*return*/, res.status(500).json({ message: "Failed to fetch itinerary" })];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.patch("/api/itineraries/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, itinerary, updatedItinerary, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!req.isAuthenticated()) {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            id = parseInt(req.params.id, 10);
                            if (isNaN(id)) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid itinerary ID" })];
                            }
                            return [4 /*yield*/, storage_1.storage.getItineraryById(id)];
                        case 2:
                            itinerary = _a.sent();
                            if (!itinerary) {
                                return [2 /*return*/, res.status(404).json({ message: "Itinerary not found" })];
                            }
                            // Only the agent can update the itinerary
                            if (req.user.role !== "agent" || itinerary.agentId !== parseInt(req.user.id, 10)) {
                                return [2 /*return*/, res.status(403).json({ message: "Forbidden" })];
                            }
                            return [4 /*yield*/, storage_1.storage.updateItinerary(id, req.body)];
                        case 3:
                            updatedItinerary = _a.sent();
                            return [2 /*return*/, res.json(updatedItinerary)];
                        case 4:
                            error_10 = _a.sent();
                            console.error('Error updating itinerary:', error_10);
                            return [2 /*return*/, res.status(500).json({ message: "Failed to update itinerary" })];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Messages
            app.post("/api/messages", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var senderId, data, message, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!req.isAuthenticated()) {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            senderId = parseInt(req.user.id, 10);
                            if (isNaN(senderId)) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid sender ID" })];
                            }
                            data = schema_1.insertMessageSchema.parse(__assign(__assign({}, req.body), { senderId: senderId }));
                            return [4 /*yield*/, storage_1.storage.createMessage(data)];
                        case 2:
                            message = _a.sent();
                            return [2 /*return*/, res.status(201).json(message)];
                        case 3:
                            error_11 = _a.sent();
                            if (error_11 instanceof zod_1.z.ZodError) {
                                return [2 /*return*/, res.status(400).json({
                                        message: "Invalid message data",
                                        errors: error_11.errors
                                    })];
                            }
                            console.error('Error sending message:', error_11);
                            return [2 /*return*/, res.status(500).json({ message: "Failed to send message" })];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/messages", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, receiverId, messages, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!req.isAuthenticated()) {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            userId = parseInt(req.user.id, 10);
                            if (isNaN(userId)) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid user ID" })];
                            }
                            receiverId = req.query.receiverId ? parseInt(req.query.receiverId, 10) : undefined;
                            if (receiverId !== undefined && isNaN(receiverId)) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid receiver ID" })];
                            }
                            return [4 /*yield*/, storage_1.storage.getMessagesByUserId(userId, receiverId)];
                        case 2:
                            messages = _a.sent();
                            return [2 /*return*/, res.json(messages)];
                        case 3:
                            error_12 = _a.sent();
                            console.error('Error fetching messages:', error_12);
                            return [2 /*return*/, res.status(500).json({ message: "Failed to fetch messages" })];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Reviews
            app.post("/api/reviews", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var travelerId, reviewData, data_1, itineraries, hasWorkedWithAgent, review, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!req.isAuthenticated() || req.user.role !== "traveler") {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            travelerId = parseInt(req.user.id, 10);
                            if (isNaN(travelerId)) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid user ID" })];
                            }
                            reviewData = __assign(__assign({}, req.body), { userId: travelerId });
                            data_1 = schema_1.insertReviewSchema.parse(reviewData);
                            return [4 /*yield*/, storage_1.storage.getItinerariesByTravelerId(travelerId)];
                        case 2:
                            itineraries = _a.sent();
                            hasWorkedWithAgent = itineraries.some(function (it) { return it.agentId === data_1.agentId; });
                            if (!hasWorkedWithAgent) {
                                return [2 /*return*/, res.status(403).json({ message: "You can only review agents you've worked with" })];
                            }
                            return [4 /*yield*/, storage_1.storage.createReview(data_1)];
                        case 3:
                            review = _a.sent();
                            // Update agent's rating
                            return [4 /*yield*/, storage_1.storage.updateAgentRating(data_1.agentId)];
                        case 4:
                            // Update agent's rating
                            _a.sent();
                            res.status(201).json(review);
                            return [3 /*break*/, 6];
                        case 5:
                            error_13 = _a.sent();
                            if (error_13 instanceof zod_1.z.ZodError) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid review data", errors: error_13.errors })];
                            }
                            res.status(500).json({ message: "Failed to create review" });
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/reviews/agent/:agentId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var agentId, reviews, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            agentId = parseInt(req.params.agentId);
                            return [4 /*yield*/, storage_1.storage.getReviewsByAgentId(agentId)];
                        case 1:
                            reviews = _a.sent();
                            res.json(reviews);
                            return [3 /*break*/, 3];
                        case 2:
                            error_14 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch reviews" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            httpServer = (0, http_1.createServer)(app);
            wss = new ws_1.WebSocketServer({ server: httpServer, path: '/ws' });
            clients = new Map();
            wss.on('connection', function (ws, req) {
                console.log('WebSocket client connected');
                // Handle receiving messages
                ws.on('message', function (message) { return __awaiter(_this, void 0, void 0, function () {
                    var parsedMessage, userId, messageData, savedMessage, outgoingMessage, recipientWs, error_15;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 4, , 5]);
                                parsedMessage = JSON.parse(message.toString());
                                if (!(parsedMessage.type === 'auth')) return [3 /*break*/, 1];
                                userId = parsedMessage.userId;
                                if (userId) {
                                    clients.set(userId, ws);
                                    console.log("User ".concat(userId, " authenticated on WebSocket"));
                                    // Send confirmation
                                    ws.send(JSON.stringify({
                                        type: 'auth_success',
                                        message: 'Authentication successful'
                                    }));
                                }
                                return [3 /*break*/, 3];
                            case 1:
                                if (!(parsedMessage.type === 'message')) return [3 /*break*/, 3];
                                // Process and store the message
                                if (!parsedMessage.senderId || !parsedMessage.receiverId || !parsedMessage.content) {
                                    ws.send(JSON.stringify({
                                        type: 'error',
                                        message: 'Invalid message format'
                                    }));
                                    return [2 /*return*/];
                                }
                                messageData = {
                                    senderId: parsedMessage.senderId,
                                    receiverId: parsedMessage.receiverId,
                                    content: parsedMessage.content,
                                    isRead: false
                                };
                                return [4 /*yield*/, storage_1.storage.createMessage(messageData)];
                            case 2:
                                savedMessage = _a.sent();
                                outgoingMessage = {
                                    type: 'new_message',
                                    message: savedMessage
                                };
                                recipientWs = clients.get(parsedMessage.receiverId);
                                if (recipientWs && recipientWs.readyState === ws_1.WebSocket.OPEN) {
                                    recipientWs.send(JSON.stringify(outgoingMessage));
                                }
                                // Send confirmation to sender
                                ws.send(JSON.stringify({
                                    type: 'message_sent',
                                    messageId: savedMessage.id
                                }));
                                _a.label = 3;
                            case 3: return [3 /*break*/, 5];
                            case 4:
                                error_15 = _a.sent();
                                console.error('WebSocket message error:', error_15);
                                ws.send(JSON.stringify({
                                    type: 'error',
                                    message: 'Failed to process message'
                                }));
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                // Handle disconnection
                ws.on('close', function () {
                    // Remove client from the connections map
                    clients.forEach(function (client, userId) {
                        if (client === ws) {
                            clients.delete(userId);
                            console.log("User ".concat(userId, " disconnected from WebSocket"));
                        }
                    });
                });
            });
            return [2 /*return*/, httpServer];
        });
    });
}

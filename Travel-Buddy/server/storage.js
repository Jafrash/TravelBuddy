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
exports.storage = exports.DatabaseStorage = void 0;
var schema_1 = require("@shared/schema");
var express_session_1 = require("express-session");
var connect_pg_simple_1 = require("connect-pg-simple");
var db_1 = require("./db");
var drizzle_orm_1 = require("drizzle-orm");
var PostgresSessionStore = (0, connect_pg_simple_1.default)(express_session_1.default);
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
        try {
            this.sessionStore = new PostgresSessionStore({
                pool: db_1.pool,
                createTableIfMissing: true,
                tableName: 'session',
                ttl: 60 * 60 * 24 * 7, // 1 week in seconds
                pruneSessionInterval: 60 * 60, // Check for expired sessions every hour
                errorLog: function (message) { return console.error('Session Store Error:', message); }
            });
            console.log('✅ Session store initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize session store:', error);
            throw error;
        }
    }
    DatabaseStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error retrieving user:", error_1);
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.username, username))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error retrieving user by username:", error_2);
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUser = function (insertUser) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.insert(schema_1.users).values(insertUser).returning()];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error creating user:", error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Agent profiles
    DatabaseStorage.prototype.getAgents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var agentProfilesData, agentsWithProfiles, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.agentProfiles)];
                    case 1:
                        agentProfilesData = _a.sent();
                        return [4 /*yield*/, Promise.all(agentProfilesData.map(function (profile) { return __awaiter(_this, void 0, void 0, function () {
                                var user;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, profile.userId))];
                                        case 1:
                                            user = (_a.sent())[0];
                                            if (!user)
                                                throw new Error("User not found for agent profile ID: ".concat(profile.id));
                                            return [2 /*return*/, __assign(__assign({}, profile), user)];
                                    }
                                });
                            }); }))];
                    case 2:
                        agentsWithProfiles = _a.sent();
                        return [2 /*return*/, agentsWithProfiles];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Error retrieving agents:", error_4);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAgentById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var agentProfile, user, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.agentProfiles).where((0, drizzle_orm_1.eq)(schema_1.agentProfiles.userId, id))];
                    case 1:
                        agentProfile = (_a.sent())[0];
                        if (!agentProfile)
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, agentProfile.userId))];
                    case 2:
                        user = (_a.sent())[0];
                        if (!user)
                            return [2 /*return*/, undefined];
                        return [2 /*return*/, __assign(__assign({}, agentProfile), user)];
                    case 3:
                        error_5 = _a.sent();
                        console.error("Error retrieving agent by ID:", error_5);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.createAgentProfile = function (profile) {
        return __awaiter(this, void 0, void 0, function () {
            var agentProfile, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.insert(schema_1.agentProfiles).values(profile).returning()];
                    case 1:
                        agentProfile = (_a.sent())[0];
                        return [2 /*return*/, agentProfile];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Error creating agent profile:", error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateAgentRating = function (agentId) {
        return __awaiter(this, void 0, void 0, function () {
            var reviewsData, totalRating, averageRating, agentProfile, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.reviews).where((0, drizzle_orm_1.eq)(schema_1.reviews.agentId, agentId))];
                    case 1:
                        reviewsData = _a.sent();
                        if (reviewsData.length === 0)
                            return [2 /*return*/];
                        totalRating = reviewsData.reduce(function (sum, review) { return sum + review.rating; }, 0);
                        averageRating = Math.round(totalRating / reviewsData.length);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.agentProfiles).where((0, drizzle_orm_1.eq)(schema_1.agentProfiles.userId, agentId))];
                    case 2:
                        agentProfile = (_a.sent())[0];
                        if (!agentProfile) return [3 /*break*/, 4];
                        return [4 /*yield*/, db_1.db.update(schema_1.agentProfiles)
                                .set({
                                rating: averageRating,
                                reviewCount: reviewsData.length
                            })
                                .where((0, drizzle_orm_1.eq)(schema_1.agentProfiles.userId, agentId))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_7 = _a.sent();
                        console.error("Error updating agent rating:", error_7);
                        throw error_7;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Trip preferences
    DatabaseStorage.prototype.createTripPreference = function (preference) {
        return __awaiter(this, void 0, void 0, function () {
            var tripPreference, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.insert(schema_1.tripPreferences).values(preference).returning()];
                    case 1:
                        tripPreference = (_a.sent())[0];
                        return [2 /*return*/, tripPreference];
                    case 2:
                        error_8 = _a.sent();
                        console.error("Error creating trip preference:", error_8);
                        throw error_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTripPreferencesByTravelerId = function (travelerId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.tripPreferences).where((0, drizzle_orm_1.eq)(schema_1.tripPreferences.travelerId, travelerId))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        console.error("Error retrieving trip preferences by traveler ID:", error_9);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAllTripPreferences = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.tripPreferences)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_10 = _a.sent();
                        console.error("Error retrieving all trip preferences:", error_10);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Itineraries
    DatabaseStorage.prototype.createItinerary = function (itinerary) {
        return __awaiter(this, void 0, void 0, function () {
            var newItinerary, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.insert(schema_1.itineraries).values(itinerary).returning()];
                    case 1:
                        newItinerary = (_a.sent())[0];
                        return [2 /*return*/, newItinerary];
                    case 2:
                        error_11 = _a.sent();
                        console.error("Error creating itinerary:", error_11);
                        throw error_11;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getItineraryById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var itinerary, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.itineraries).where((0, drizzle_orm_1.eq)(schema_1.itineraries.id, id))];
                    case 1:
                        itinerary = (_a.sent())[0];
                        return [2 /*return*/, itinerary];
                    case 2:
                        error_12 = _a.sent();
                        console.error("Error retrieving itinerary by ID:", error_12);
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getItinerariesByTravelerId = function (travelerId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.itineraries).where((0, drizzle_orm_1.eq)(schema_1.itineraries.travelerId, travelerId))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_13 = _a.sent();
                        console.error("Error retrieving itineraries by traveler ID:", error_13);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getItinerariesByAgentId = function (agentId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.itineraries).where((0, drizzle_orm_1.eq)(schema_1.itineraries.agentId, agentId))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_14 = _a.sent();
                        console.error("Error retrieving itineraries by agent ID:", error_14);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateItinerary = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var itinerary, updatedData, updatedItinerary, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.itineraries).where((0, drizzle_orm_1.eq)(schema_1.itineraries.id, id))];
                    case 1:
                        itinerary = (_a.sent())[0];
                        if (!itinerary) {
                            throw new Error("Itinerary not found");
                        }
                        updatedData = __assign(__assign({}, data), { updatedAt: new Date() });
                        return [4 /*yield*/, db_1.db.update(schema_1.itineraries)
                                .set(updatedData)
                                .where((0, drizzle_orm_1.eq)(schema_1.itineraries.id, id))
                                .returning()];
                    case 2:
                        updatedItinerary = (_a.sent())[0];
                        return [2 /*return*/, updatedItinerary];
                    case 3:
                        error_15 = _a.sent();
                        console.error("Error updating itinerary:", error_15);
                        throw error_15;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Messages
    DatabaseStorage.prototype.createMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var newMessage, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.insert(schema_1.messages).values(message).returning()];
                    case 1:
                        newMessage = (_a.sent())[0];
                        return [2 /*return*/, newMessage];
                    case 2:
                        error_16 = _a.sent();
                        console.error("Error creating message:", error_16);
                        throw error_16;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getMessagesByUserId = function (userId, receiverId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!receiverId) return [3 /*break*/, 2];
                        return [4 /*yield*/, db_1.db.select()
                                .from(schema_1.messages)
                                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, userId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, receiverId)), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, receiverId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, userId))))
                                .orderBy(schema_1.messages.sentAt)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, db_1.db.select()
                            .from(schema_1.messages)
                            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, userId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, userId)))
                            .orderBy(schema_1.messages.sentAt)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_17 = _a.sent();
                        console.error("Error retrieving messages by user ID:", error_17);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Reviews
    DatabaseStorage.prototype.createReview = function (review) {
        return __awaiter(this, void 0, void 0, function () {
            var newReview, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.insert(schema_1.reviews).values(review).returning()];
                    case 1:
                        newReview = (_a.sent())[0];
                        return [2 /*return*/, newReview];
                    case 2:
                        error_18 = _a.sent();
                        console.error("Error creating review:", error_18);
                        throw error_18;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getReviewsByAgentId = function (agentId) {
        return __awaiter(this, void 0, void 0, function () {
            var reviewsData, error_19;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.reviews).where((0, drizzle_orm_1.eq)(schema_1.reviews.agentId, agentId))];
                    case 1:
                        reviewsData = _a.sent();
                        return [4 /*yield*/, Promise.all(reviewsData.map(function (review) { return __awaiter(_this, void 0, void 0, function () {
                                var traveler;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, review.travelerId))];
                                        case 1:
                                            traveler = (_a.sent())[0];
                                            return [2 /*return*/, __assign(__assign({}, review), { traveler: {
                                                        fullName: (traveler === null || traveler === void 0 ? void 0 : traveler.fullName) || "Unknown User",
                                                        profilePicture: (traveler === null || traveler === void 0 ? void 0 : traveler.profilePicture) || ""
                                                    } })];
                                    }
                                });
                            }); }))];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_19 = _a.sent();
                        console.error("Error retrieving reviews by agent ID:", error_19);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DatabaseStorage;
}());
exports.DatabaseStorage = DatabaseStorage;
exports.storage = new DatabaseStorage();

"use strict";
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
exports.placesService = exports.PlacesService = void 0;
var axios_1 = require("axios");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var url_1 = require("url");
// Get the root directory path (two levels up from this file)
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var rootDir = path_1.default.resolve(__dirname, '..', '..');
// Load environment variables from the root .env file
dotenv_1.default.config({ path: path_1.default.join(rootDir, '.env') });
// Debug log to verify environment variables
console.log('Environment variables loaded from:', path_1.default.join(rootDir, '.env'));
console.log('FOURSQUARE_API_KEY present:', !!process.env.FOURSQUARE_API_KEY);
var GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
// Fallback city coordinates for common cities
var CITY_COORDINATES = {
    'new york': { lat: 40.7128, lon: -74.006, display_name: 'New York, NY, USA' },
    'london': { lat: 51.5074, lon: -0.1278, display_name: 'London, UK' },
    'paris': { lat: 48.8566, lon: 2.3522, display_name: 'Paris, France' },
    'tokyo': { lat: 35.6762, lon: 139.6503, display_name: 'Tokyo, Japan' },
    'sydney': { lat: -33.8688, lon: 151.2093, display_name: 'Sydney, Australia' },
    'mumbai': { lat: 19.0760, lon: 72.8777, display_name: 'Mumbai, India' },
    'dubai': { lat: 25.2048, lon: 55.2708, display_name: 'Dubai, UAE' },
    'singapore': { lat: 1.3521, lon: 103.8198, display_name: 'Singapore' },
    'toronto': { lat: 43.6532, lon: -79.3832, display_name: 'Toronto, Canada' },
    'berlin': { lat: 52.5200, lon: 13.4050, display_name: 'Berlin, Germany' },
};
var PlacesService = /** @class */ (function () {
    function PlacesService() {
    }
    PlacesService.getInstance = function () {
        if (!PlacesService.instance) {
            PlacesService.instance = new PlacesService();
        }
        return PlacesService.instance;
    };
    PlacesService.prototype.getCityPlaces = function (cityName) {
        return __awaiter(this, void 0, void 0, function () {
            var city_1, places, cityInfo, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log("\uD83D\uDD0D Getting places for city: ".concat(cityName));
                        return [4 /*yield*/, this.searchCity(cityName)];
                    case 1:
                        city_1 = _a.sent();
                        if (!city_1) {
                            console.error('❌ Could not find coordinates for city:', cityName);
                            return [2 /*return*/, null];
                        }
                        console.log("\uD83D\uDCCD Found city: ".concat(city_1.display_name, " (").concat(city_1.lat, ", ").concat(city_1.lon, ")"));
                        return [4 /*yield*/, this.searchPlaces('attraction', city_1.lat, city_1.lon)];
                    case 2:
                        places = _a.sent();
                        if (!places || places.length === 0) {
                            console.log('⚠️ No places found, using fallback data');
                            return [2 /*return*/, null];
                        }
                        cityInfo = {
                            name: city_1.display_name.split(',')[0],
                            description: "Explore the beautiful city of ".concat(city_1.display_name.split(',')[0], ", known for its rich culture, history, and attractions."),
                            bestTimeToVisit: 'The best time to visit is during spring (March to May) and fall (September to November) when the weather is pleasant.',
                            places: places.map(function (place) {
                                var _a;
                                return ({
                                    name: place.name,
                                    description: place.description || "A popular place in ".concat(city_1.display_name.split(',')[0]),
                                    categories: place.categories,
                                    rating: place.rate,
                                    image: (_a = place.preview) === null || _a === void 0 ? void 0 : _a.source,
                                    wikipedia: '' // We can add Wikipedia links later if needed
                                });
                            })
                        };
                        console.log("\u2705 Found ".concat(places.length, " places for ").concat(city_1.display_name));
                        return [2 /*return*/, cityInfo];
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ Error in getCityPlaces:', error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PlacesService.prototype.searchCity = function (cityName) {
        return __awaiter(this, void 0, void 0, function () {
            var lowerCityName, response, feature, coordinates, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("\uD83D\uDD0D Geocoding city: ".concat(cityName));
                        lowerCityName = cityName.toLowerCase();
                        if (CITY_COORDINATES[lowerCityName]) {
                            console.log("\uD83D\uDCCD Using predefined coordinates for: ".concat(cityName));
                            return [2 /*return*/, CITY_COORDINATES[lowerCityName]];
                        }
                        if (!GEOAPIFY_API_KEY) {
                            console.error('❌ Geoapify API key is not configured');
                            return [2 /*return*/, CITY_COORDINATES['new york']];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get('https://api.geoapify.com/v1/geocode/search', {
                                params: {
                                    text: cityName,
                                    apiKey: GEOAPIFY_API_KEY,
                                    limit: 1
                                }
                            })];
                    case 2:
                        response = _c.sent();
                        if (((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.features) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                            feature = response.data.features[0];
                            coordinates = {
                                lat: feature.properties.lat,
                                lon: feature.properties.lon,
                                display_name: feature.properties.formatted
                            };
                            console.log('📍 City coordinates:', JSON.stringify(coordinates, null, 2));
                            return [2 /*return*/, coordinates];
                        }
                        console.log('❌ No coordinates found for city:', cityName);
                        return [2 /*return*/, CITY_COORDINATES['new york']];
                    case 3:
                        error_2 = _c.sent();
                        console.error('❌ Error geocoding city with Geoapify:', error_2);
                        console.log('⚠️ Using fallback coordinates for New York');
                        return [2 /*return*/, CITY_COORDINATES['new york']];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calculate distance between two points in meters using Haversine formula
     */
    PlacesService.prototype.calculateDistance = function (lat1, lon1, lat2, lon2) {
        var R = 6371e3; // Earth's radius in meters
        var φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        var φ2 = lat2 * Math.PI / 180;
        var Δφ = (lat2 - lat1) * Math.PI / 180;
        var Δλ = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
    };
    PlacesService.prototype.searchPlaces = function (query, lat, lon) {
        return __awaiter(this, void 0, void 0, function () {
            var placesUrl, categories, radius, response, places, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🌐 Making request to Geoapify Places API');
                        console.log('🔑 Geoapify API Key:', GEOAPIFY_API_KEY ? 'Present' : 'Missing');
                        console.log('Search Parameters:', { query: query, lat: lat, lon: lon });
                        if (!GEOAPIFY_API_KEY) {
                            console.error('❌ Geoapify API key is not configured');
                            console.error('Make sure GEOAPIFY_API_KEY is set in your .env file');
                            console.error('Current .env file location:', path_1.default.join(rootDir, '.env'));
                            console.error('Environment variables:', {
                                GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY ? 'Set' : 'Not Set',
                                NODE_ENV: process.env.NODE_ENV
                            });
                            throw new Error('Geoapify API key is not configured');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('🔍 Searching for places...');
                        placesUrl = 'https://api.geoapify.com/v2/places';
                        categories = 'tourism,entertainment,catering,commercial';
                        radius = 5000;
                        console.log('📡 Sending request to Geoapify Places API');
                        console.log('Request URL:', placesUrl);
                        console.log('Request params:', {
                            categories: categories,
                            filter: "circle:".concat(lon, ",").concat(lat, ",").concat(radius),
                            bias: "proximity:".concat(lon, ",").concat(lat),
                            limit: 10,
                            apiKey: '***' // Don't log the actual API key
                        });
                        return [4 /*yield*/, axios_1.default.get(placesUrl, {
                                params: {
                                    categories: categories,
                                    filter: "circle:".concat(lon, ",").concat(lat, ",").concat(radius),
                                    bias: "proximity:".concat(lon, ",").concat(lat),
                                    limit: 10,
                                    apiKey: GEOAPIFY_API_KEY
                                },
                                timeout: 10000 // 10 second timeout
                            })];
                    case 2:
                        response = _a.sent();
                        console.log('✅ Search successful');
                        console.log('Response status:', response.status);
                        places = response.data.features || [];
                        console.log("\u2705 Found ".concat(places.length, " places"));
                        if (places.length === 0) {
                            console.log('No places found, using fallback data');
                            return [2 /*return*/, []];
                        }
                        // Map the places to our Place interface
                        return [2 /*return*/, places.map(function (place) {
                                var properties = place.properties;
                                console.log('Processing place:', properties.name);
                                // Calculate distance in meters from the center point
                                var distance = _this.calculateDistance(lat, lon, properties.lat, properties.lon);
                                return {
                                    xid: properties.place_id || "place-".concat(Math.random().toString(36).substr(2, 9)),
                                    name: properties.name || 'Unnamed Location',
                                    rate: properties.rate || 0,
                                    kinds: properties.categories ? properties.categories.join(',') : '',
                                    point: {
                                        lon: properties.lon,
                                        lat: properties.lat
                                    },
                                    preview: properties.preview ? {
                                        source: properties.preview.source
                                    } : undefined,
                                    categories: properties.categories || [],
                                    description: properties.address_line2 || properties.address_line1 || '',
                                    distance: Math.round(distance)
                                };
                            })];
                    case 3:
                        error_3 = _a.sent();
                        if (axios_1.default.isAxiosError(error_3)) {
                            console.error('❌ Error searching for places with Geoapify:', error_3.message);
                            if (error_3.response) {
                                console.error('Response status:', error_3.response.status);
                                console.error('Response data:', error_3.response.data);
                            }
                            else if (error_3.request) {
                                console.error('No response received:', error_3.request);
                            }
                        }
                        else if (error_3 instanceof Error) {
                            console.error('Error:', error_3.message);
                        }
                        else {
                            console.error('An unexpected error occurred');
                        }
                        console.error('Using fallback data due to error');
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PlacesService.prototype.getFallbackPlaces = function () {
        console.log('⚠️ Using fallback places data');
        // Fallback data in case the API fails
        return [
            {
                xid: 'fallback-1',
                name: 'Statue of Liberty',
                rate: 4.7,
                kinds: 'historical_places,monuments,landmarks',
                point: {
                    lon: -74.0445,
                    lat: 40.6892
                },
                preview: {
                    source: 'https://via.placeholder.com/400x300?text=Statue+of+Liberty'
                },
                categories: ['Landmark', 'Monument'],
                description: 'Iconic symbol of freedom and democracy',
                distance: 0
            },
            // More fallback places...
        ];
    };
    PlacesService.prototype.search = function (query, cityName) {
        return __awaiter(this, void 0, void 0, function () {
            var city, places, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log("\uD83D\uDD0D Starting search for \"".concat(query, "\" in ").concat(cityName));
                        return [4 /*yield*/, this.searchCity(cityName)];
                    case 1:
                        city = _a.sent();
                        if (!city) {
                            console.error('❌ Could not find coordinates for city:', cityName);
                            return [2 /*return*/, this.getFallbackPlaces()];
                        }
                        console.log("\uD83D\uDCCD Found city: ".concat(city.display_name, " (").concat(city.lat, ", ").concat(city.lon, ")"));
                        return [4 /*yield*/, this.searchPlaces(query, city.lat, city.lon)];
                    case 2:
                        places = _a.sent();
                        if (!places || places.length === 0) {
                            console.log('⚠️ No places found, using fallback data');
                            return [2 /*return*/, this.getFallbackPlaces()];
                        }
                        console.log("\u2705 Found ".concat(places.length, " places"));
                        return [2 /*return*/, places];
                    case 3:
                        error_4 = _a.sent();
                        console.error('❌ Error in search:', error_4);
                        return [2 /*return*/, this.getFallbackPlaces()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return PlacesService;
}());
exports.PlacesService = PlacesService;
exports.placesService = PlacesService.getInstance();

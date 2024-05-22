"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
// Funkcija za pridobivanje podatkov iz URL-ja
function scrapeSportsData(url, category) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio.load(data);
            const sports = [];
            // Prilagodite selektorje glede na strukturo spletne strani
            $('.list tbody tr').each((index, element) => {
                const name = $(element).find('td:nth-child(2)').text().trim();
                const rating = $(element).find('td:nth-child(3)').text().trim();
                sports.push({ name, rating });
            });
            return sports;
        }
        catch (error) {
            console.error(`Napaka pri pridobivanju podatkov: ${error.message}`);
            return [];
        }
    });
}
// Funkcija za pridobivanje naslovov <h3> iz URL-ja
function scrapeHeaders(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            const h3Titles = [];
            $('h3').each((index, element) => {
                if (index < 30) { // Shranimo le prvih 30 naslovov
                    h3Titles.push($(element).text().trim());
                }
            });
            return h3Titles;
        }
        catch (error) {
            console.error('Napaka pri pridobivanju podatkov:', error);
            return [];
        }
    });
}
// Poženitev obeh funkcij za podane URL-je
function runScrapers() {
    return __awaiter(this, void 0, void 0, function* () {
        const sportsUrl = 'https://www.topendsports.com/world/lists/fittest-sport/your-list.htm';
        const headersUrl = 'https://www.spartan.com/blogs/unbreakable-training/best-exercises-for-functional-strength';
        const sports = yield scrapeSportsData(sportsUrl, 'Conditioning');
        console.log('Športi:', sports);
        const headers = yield scrapeHeaders(headersUrl);
        console.log('Naslovi <h3>:', headers);
    });
}
runScrapers();

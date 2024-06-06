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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const pg_1 = require("pg");
// Konfiguracija za povezavo s Postgres bazo
const pool = new pg_1.Pool({
    user: 'myuser',
    host: 'localhost',
    database: 'mydatabase',
    password: 'mypassword',
    port: 5432,
});
// Preveri povezavo
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Napaka pri povezavi s podatkovno bazo', err.stack);
    }
    console.log('Povezan s podatkovno bazo');
    release();
});
// Preveri, če tabela obstaja
function checkTableExists() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'strengthexercisesscrapedata'
        );
    `;
        try {
            const res = yield pool.query(query);
            if (res.rows[0].exists) {
                console.log('Tabela obstaja.');
            }
            else {
                console.log('Tabela ne obstaja.');
            }
        }
        catch (err) {
            console.error('Napaka pri preverjanju tabele', err.stack);
        }
    });
}
// Funkcija za pridobivanje podatkov iz URL-ja
function scrapeSportsData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio_1.default.load(data);
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
function saveSportsDataToDatabase(sports) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield pool.connect();
        try {
            yield client.query('BEGIN'); // Začetek transakcije
            for (const sport of sports) {
                yield client.query('INSERT INTO SportsScrapeData (name, rating) VALUES ($1, $2)', [sport.name, sport.rating]);
            }
            yield client.query('COMMIT'); // Potrditev transakcije
            console.log('Podatki o športih so bili uspešno shranjeni v podatkovno bazo.');
        }
        catch (error) {
            yield client.query('ROLLBACK'); // Preklic transakcije v primeru napake
            console.error('Napaka pri shranjevanju podatkov v podatkovno bazo:', error);
        }
        finally {
            client.release(); // Sprostitev klienta
        }
    });
}
// Funkcija za pridobivanje naslovov <h3> iz URL-ja
function scrapestrengthExersices(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            const html = response.data;
            const $ = cheerio_1.default.load(html);
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
// Funkcija za shranjevanje podatkov o najboljših vajah za moč v Postgres bazo
function saveStrengthExercisesToDatabase(strengthExercises) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield pool.connect();
        try {
            yield client.query('BEGIN'); // Začetek transakcije
            for (const exercise of strengthExercises) {
                yield client.query('INSERT INTO StrengthExercisesScrapeData (name) VALUES ($1)', [exercise]);
            }
            yield client.query('COMMIT'); // Potrditev transakcije
            console.log('Podatki o najboljših vajah za moč so bili uspešno shranjeni v podatkovno bazo.');
        }
        catch (error) {
            yield client.query('ROLLBACK'); // Preklic transakcije v primeru napake
            console.error('Napaka pri shranjevanju podatkov v podatkovno bazo:', error);
        }
        finally {
            client.release(); // Sprostitev klienta
        }
    });
}
// Poženitev obeh funkcij za podane URL-je
function runScrapers() {
    return __awaiter(this, void 0, void 0, function* () {
        checkTableExists();
        const sportsUrl = 'https://www.topendsports.com/world/lists/fittest-sport/your-list.htm';
        const strengthsUrl = 'https://www.spartan.com/blogs/unbreakable-training/best-exercises-for-functional-strength';
        const sports = yield scrapeSportsData(sportsUrl);
        console.log('Hardest sports:', sports);
        yield saveSportsDataToDatabase(sports);
        const strengthExersicesArray = yield scrapestrengthExersices(strengthsUrl);
        console.log('Best strength exercises:', strengthExersicesArray);
        yield saveStrengthExercisesToDatabase(strengthExersicesArray);
    });
}
runScrapers();

import axios from 'axios';
import cheerio from 'cheerio';
import { Pool } from 'pg';

// Konfiguracija za povezavo s Postgres bazo
const pool = new Pool({
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
async function checkTableExists() {
    const query = `
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'strengthexercisesscrapedata'
        );
    `;

    try {
        const res = await pool.query(query);
        if (res.rows[0].exists) {
            console.log('Tabela obstaja.');
        } else {
            console.log('Tabela ne obstaja.');
        }
    } catch (err: unknown) {
        console.error('Napaka pri preverjanju tabele', (err as Error).stack);
    }
}


interface Sport {
    name: string;
    rating: string;
}

// Funkcija za pridobivanje podatkov iz URL-ja
async function scrapeSportsData(url: string): Promise<Sport[]> {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const sports: Sport[] = [];

        // Prilagodite selektorje glede na strukturo spletne strani
        $('.list tbody tr').each((index, element) => {
            const name = $(element).find('td:nth-child(2)').text().trim();
            const rating = $(element).find('td:nth-child(3)').text().trim();
            sports.push({ name, rating });
        });

        return sports;
    } catch (error) {
        console.error(`Napaka pri pridobivanju podatkov: ${(error as Error).message}`);
        return [];
    }
}

async function saveSportsDataToDatabase(sports: Sport[]): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Začetek transakcije

        for (const sport of sports) {
            await client.query('INSERT INTO SportsScrapeData (name, rating) VALUES ($1, $2)', [sport.name, sport.rating]);
        }

        await client.query('COMMIT'); // Potrditev transakcije
        console.log('Podatki o športih so bili uspešno shranjeni v podatkovno bazo.');
    } catch (error) {
        await client.query('ROLLBACK'); // Preklic transakcije v primeru napake
        console.error('Napaka pri shranjevanju podatkov v podatkovno bazo:', error);
    } finally {
        client.release(); // Sprostitev klienta
    }
}

// Funkcija za pridobivanje naslovov <h3> iz URL-ja
async function scrapestrengthExersices(url: string): Promise<string[]> {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const h3Titles: string[] = [];
        $('h3').each((index, element) => {
            if (index < 30) { // Shranimo le prvih 30 naslovov
                h3Titles.push($(element).text().trim());
            }
        });

        return h3Titles;
    } catch (error) {
        console.error('Napaka pri pridobivanju podatkov:', error);
        return [];
    }
}

// Funkcija za shranjevanje podatkov o najboljših vajah za moč v Postgres bazo
async function saveStrengthExercisesToDatabase(strengthExercises: string[]): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Začetek transakcije

        for (const exercise of strengthExercises) {
            await client.query('INSERT INTO StrengthExercisesScrapeData (name) VALUES ($1)', [exercise]);
        }

        await client.query('COMMIT'); // Potrditev transakcije
        console.log('Podatki o najboljših vajah za moč so bili uspešno shranjeni v podatkovno bazo.');
    } catch (error) {
        await client.query('ROLLBACK'); // Preklic transakcije v primeru napake
        console.error('Napaka pri shranjevanju podatkov v podatkovno bazo:', error);
    } finally {
        client.release(); // Sprostitev klienta
    }
}

// Poženitev obeh funkcij za podane URL-je
async function runScrapers() {
    checkTableExists();
    const sportsUrl = 'https://www.topendsports.com/world/lists/fittest-sport/your-list.htm';
    const strengthsUrl = 'https://www.spartan.com/blogs/unbreakable-training/best-exercises-for-functional-strength';

    const sports = await scrapeSportsData(sportsUrl);
    console.log('Hardest sports:', sports);
    await saveSportsDataToDatabase(sports);

    const strengthExersicesArray = await scrapestrengthExersices(strengthsUrl);
    console.log('Best strength exercises:', strengthExersicesArray);
    await saveStrengthExercisesToDatabase(strengthExersicesArray);
}

runScrapers();
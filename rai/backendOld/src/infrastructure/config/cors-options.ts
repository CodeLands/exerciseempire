// src/infrastructure/config/corsOptions.ts
import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
    origin: '*', // or more securely, specify your domain
    optionsSuccessStatus: 200
};

export default corsOptions;

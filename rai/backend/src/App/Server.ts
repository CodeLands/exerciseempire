import 'reflect-metadata';
import dotenv from 'dotenv';

import { appContainer } from '/App/AppContainer';
import { createApp } from '/Shared/BaseApp';

dotenv.config();

const app = createApp(appContainer);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

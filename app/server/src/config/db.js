import { Pool } from "pg";
import fsp from "fs/promises";
import path from "path";
import { config } from "dotenv";
config();
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

// if (!process.env.DATABASE_URL) {
//     throw new Error("DATABASE_URL is not defined in your environment variables");
// }


const {
    DB_ADDRESS,
    DB_PORT,
    DB_NAME,
    DB_SECRET_ARN,
    AWS_REGION
} = process.env;

if (!DB_ADDRESS) throw new Error("DB_ADDRESS is not defined in your environment variables");
if (!DB_PORT) throw new Error("DB_PORT is not defined in your environment variables");
if (!DB_NAME) throw new Error("DB_NAME is not defined in your environment variables");
if (!DB_SECRET_ARN) throw new Error("DB_SECRET_ARN is not defined in your environment variables");

const secretsManager = new SecretsManagerClient({ region: AWS_REGION });

// Retry wrapper: Pod Identity credentials may not be injected the instant
// the container starts (a known EKS Pod Identity webhook timing race).
// Retry a few times with backoff instead of crashing on the first attempt.
async function getSecretWithRetry(secretId, { attempts = 6, delayMs = 3000 } = {}) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      const response = await secretsManager.send(
        new GetSecretValueCommand({ SecretId: secretId })
      );
      if (!response.SecretString) {
        throw new Error("RDS secret does not contain SecretString");
      }
      return JSON.parse(response.SecretString);
    } catch (err) {
      lastErr = err;
      console.warn(
        `[db.js] Attempt ${i}/${attempts} to fetch DB secret failed: ${err.message}. Retrying in ${delayMs}ms...`
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

const dbCredentials = await getSecretWithRetry(DB_SECRET_ARN);

// create new pool of connection
const pool = new Pool({
    // connectionString: process.env.DATABASE_URL,
    host: DB_ADDRESS,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: dbCredentials.username,
    password: dbCredentials.password,
    max: 10,
    idleTimeoutMillis: 30000,
    // ssl: useSSL ? { rejectUnauthorized: false } : false,
    // ssl: process.env.NODE_ENV === "production"
    //     ? { rejectUnauthorized: true }
    //     : false,

    ssl: { rejectUnauthorized: false },
});

//to test connection
async function testConnection() {
    try {
        const client = await pool.connect(); // try to get a clienti
        console.log('Database connection successful!');
        client.release(); // release client back to pool
        return true;
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        return false;
    }
}
testConnection();

// for query log files
// const logFilePath = path.join(process.cwd(), 'logs/query.log')

// async function logToFile(logMessage) {
//   const timestamp = new Date().toISOString();
//   const fullMessage = `[${timestamp}] ${logMessage}\n`;

//     try {
//         await fsp.appendFile(logFilePath, fullMessage);
//     } catch (e) {
//         console.error('Failed to write query log: ', e);
//     }
// }

// to query database through pool
async function query(queryText, parameters) {
    try {
        const result = await pool.query(queryText, parameters);

        // console.log(`Executed query : `, {queryText, rows: result.rowCount});
        // const logMessage = `Executed query: ${queryText} |
        // Parameters: ${JSON.stringify(parameters)} | 
        // Rows affected: ${result.rowCount}
        // `;
        // // console.log(logMessage);
        // logToFile(logMessage)

        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

// to shutdown
async function shutdown() {
    try {
        await pool.end();
        console.log('Database pool has ended');
    } catch (e) {
        console.error('Error ending database pool', e);
    } finally {
        process.exit();
    }
}

// In long-running apps or scripts, closing the pool is good practice to avoid hanging processes.
// SIGINT = signal interrupt
process.on('SIGINT', shutdown);
// SIGTERM = signal terminate
process.on('SIGTERM', shutdown);

//event listener on PostgreSQL pool
// Registers a handler for the 'error' event emitted by the connection pool.
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
})

export { query, shutdown as end, testConnection };
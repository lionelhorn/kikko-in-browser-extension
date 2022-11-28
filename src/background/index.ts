import {waSqliteWebBackend} from "@kikko-land/wa-sqlite-web-backend";
import sqlWasmUrl from "@kikko-land/sql.js/dist/sql-wasm.wasm?url";
import {migrationsPlugin} from "@kikko-land/migrations-plugin";
import {sql} from "@kikko-land/boono";
import {initDbClient} from "@kikko-land/kikko";
import {absurdWebBackend} from "@kikko-land/absurd-web-backend";

const migrations = migrationsPlugin({
  migrations: [
    {
      up: async (db) => {
        await db.runQuery(
          sql`
                CREATE TABLE IF NOT EXISTS jsonRems (
                  _id TEXT NOT NULL PRIMARY KEY,
                  doc TEXT
                );
                  `,
        );

        await db.runQuery(sql`CREATE INDEX jsonRems_id ON jsonRems(_id);`);
      },
      id: 1000,
      name: "createRemJson",
    },
  ],
});

const waSqliteConfig = {
  dbName: "helloWorld",
  dbBackend: waSqliteWebBackend({
    wasmUrl: sqlWasmUrl,
    pageSize: 64 * 1024,
    cacheSize: -10000,
    vfs: "minimal",
  }),
  plugins: [migrations],
};

const absurdConfig = {
  dbName: "helloWorld",
  dbBackend: absurdWebBackend({
    wasmUrl: sqlWasmUrl,
    pageSize: 64 * 1024,
    cacheSize: -10000,
  }),
  plugins: [migrations],
};

(async () => {
    const db = await initDbClient(waSqliteConfig);
   //const db = await initDbClient(absurdConfig);
})();


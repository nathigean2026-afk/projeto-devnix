import { Pool } from "pg";
import crypto from "crypto";

const EMAIL = "contato@elevanthe.com";
const PASSWORD = "asenha12*";
const NAME = "Elevanthe Admin";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    // Verifica se usuário já existe
    const existing = await client.query(
      'SELECT id FROM "user" WHERE email = $1',
      [EMAIL]
    );

    if (existing.rows.length > 0) {
      console.log(`Usuário ${EMAIL} já existe. Atualizando senha...`);
      const passwordHash = hashPassword(PASSWORD);
      await client.query(
        'UPDATE "account" SET "password" = $1 WHERE "userId" = $2 AND "providerId" = $3',
        [passwordHash, existing.rows[0].id, "credential"]
      );
      console.log("Senha atualizada com sucesso.");
      return;
    }

    // Cria novo usuário
    const userId = crypto.randomUUID();
    const now = new Date();

    await client.query(
      'INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, NAME, EMAIL, true, now, now]
    );

    const passwordHash = hashPassword(PASSWORD);
    const accountId = crypto.randomUUID();

    await client.query(
      'INSERT INTO "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [accountId, userId, "credential", userId, passwordHash, now, now]
    );

    console.log(`Admin criado com sucesso: ${EMAIL}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Erro:", err.message);
  process.exit(1);
});

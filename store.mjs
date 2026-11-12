import { DatabaseSync } from 'node:sqlite';
import { createHash, randomBytes } from 'node:crypto';

export const token = () => randomBytes(24).toString('base64url');
export const digest = value => createHash('sha256').update(value).digest('hex');
export const db = new DatabaseSync(process.env.GC_DB ?? 'good-chapter.sqlite');
db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY, review_hash TEXT UNIQUE NOT NULL, organizer TEXT NOT NULL, recipient TEXT NOT NULL,
    title TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft'
      CHECK(status IN ('draft', 'approved', 'declined', 'closed'))
  );
  CREATE TABLE IF NOT EXISTS guests (
    id TEXT PRIMARY KEY, chapter TEXT NOT NULL REFERENCES chapters(id), name TEXT NOT NULL, approved INTEGER NOT NULL DEFAULT 0,
    token_hash TEXT UNIQUE
  );
  CREATE TABLE IF NOT EXISTS gifts (
    id TEXT PRIMARY KEY, chapter TEXT NOT NULL REFERENCES chapters(id), variant TEXT NOT NULL, title TEXT NOT NULL,
    approved INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS claims (
    id TEXT PRIMARY KEY, gift TEXT UNIQUE NOT NULL REFERENCES gifts(id), guest TEXT NOT NULL REFERENCES guests(id),
    state TEXT NOT NULL CHECK(state IN ('creating', 'checkout', 'paid')), checkout_url TEXT, order_id TEXT
  );
  CREATE TABLE IF NOT EXISTS recipient_delivery (
    chapter TEXT PRIMARY KEY REFERENCES chapters(id), email_delivered INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS released_claims (
    id TEXT PRIMARY KEY, gift TEXT NOT NULL REFERENCES gifts(id), order_id TEXT,
    reason TEXT NOT NULL, released_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS payment_conflicts (
    order_id TEXT NOT NULL, claim_id TEXT NOT NULL, quantity INTEGER NOT NULL,
    PRIMARY KEY(order_id, claim_id)
  );
`);

export function atomic(operation) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = operation();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

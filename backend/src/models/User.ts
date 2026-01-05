import { query } from '../config/db';

export interface User {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    phone?: string;
    role: 'USER' | 'ADMIN';
    avatar_url?: string;
    created_at: Date;
}

export const createUser = async (
    name: string,
    email: string,
    passwordHash: string,
    phone?: string
): Promise<User> => {
    const sql = `
    INSERT INTO users (name, email, password_hash, phone)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
    const result = await query(sql, [name, email, passwordHash, phone]);
    return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const sql = `SELECT * FROM users WHERE email = $1`;
    const result = await query(sql, [email]);
    return result.rows[0] || null;
};

export const findUserById = async (id: string): Promise<User | null> => {
    const sql = `SELECT * FROM users WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
};

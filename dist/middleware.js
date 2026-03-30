"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
// utils/supabase/middleware.ts
const server_1 = require("./server");
async function handler(req, res) {
    const { data, error } = await server_1.supabaseServer.from('_users').select('*');
    if (error)
        return res.status(500).json({ error });
    return res.status(200).json({ data });
}

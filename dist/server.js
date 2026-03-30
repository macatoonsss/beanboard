"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseServer = void 0;
// utils/supabase/server.ts
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_js_1 = require("@supabase/supabase-js");
// Load env from project root
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env.local') });
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env.local');
}
exports.supabaseServer = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
// Optional test query
(async () => {
    const { data, error } = await exports.supabaseServer.from('_users').select('*');
    if (error)
        console.error('Supabase error:', error);
    else
        console.log('Supabase data:', data);
})();

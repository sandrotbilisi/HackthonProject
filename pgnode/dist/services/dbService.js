"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseService = void 0;
const pg_1 = require("pg");
exports.databaseService = new pg_1.Client({
    host: 'ec2-54-73-22-169.eu-west-1.compute.amazonaws.com',
    database: 'del7t5ltm6lt14',
    user: 'hjbxzvizytiqzp',
    port: 5432,
    password: 'b59bdafda1f32af496d48a584564c0365df050f6df2d07a602b0363b88f7c3bb',
    ssl: {
        rejectUnauthorized: false
    }
});
//# sourceMappingURL=dbService.js.map
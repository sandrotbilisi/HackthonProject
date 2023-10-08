"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbService_1 = require("./services/dbService");
const app = (0, express_1.default)();
const port = 3001;
dbService_1.databaseService.connect();
app.use(express_1.default.json());
const cors = require('cors');
app.use(cors('origin', '*'));
app.get('/database/getPublicKey', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = req.query.address;
        const query = (yield dbService_1.databaseService.query(`SELECT public_key AS "publicKey" FROM users WHERE address = '${address}'`));
        const publicKey = query.rows.length > 0 ? query.rows[0].publicKey : undefined;
        res.send({ publicKey });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}));
app.post('/database/insertPublicKey', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { publicKey, address } = req.body;
        console.log(publicKey, address);
        const query = (yield dbService_1.databaseService.query('INSERT INTO users (public_key, address) VALUES ($1, $2) ON CONFLICT (address) DO NOTHING;', [publicKey, address]));
        res.status(200).send('OK');
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map
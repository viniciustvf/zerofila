"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api1589834500772 = void 0;
class Api1589834500772 {
    constructor() {
        this.name = 'Api1589834500772';
    }
    async up(queryRunner) {
        await queryRunner.query("CREATE TABLE `empresa` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(60) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }
    async down(queryRunner) {
        await queryRunner.query("DROP TABLE `empresa`", undefined);
    }
}
exports.Api1589834500772 = Api1589834500772;
//# sourceMappingURL=1589834500772-Api.js.map
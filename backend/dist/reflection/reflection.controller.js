"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionController = void 0;
const common_1 = require("@nestjs/common");
const reflection_service_1 = require("./reflection.service");
let ReflectionController = class ReflectionController {
    constructor(reflection) {
        this.reflection = reflection;
    }
    async getControllers(res) {
        const structure = this.reflection.getApiStructure();
        res.json(structure);
    }
    async getServices(res) {
        const structure = this.reflection.getServiceStructure();
        res.json(structure);
    }
    async getAll(res) {
        const controllers = this.reflection.getApiStructure();
        const services = this.reflection.getServiceStructure();
        res.json({
            controllers,
            services,
            summary: {
                totalControllers: controllers.length,
                totalServices: services.length,
                totalEndpoints: controllers.reduce((sum, c) => sum + c.methods.length, 0),
            }
        });
    }
    async getHtml(res) {
        const controllers = this.reflection.getApiStructure();
        const services = this.reflection.getServiceStructure();
        const html = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Structure - Księgarnia</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    h2 { color: #555; margin-top: 30px; }
    .controller, .service { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .controller h3, .service h3 { margin: 0 0 10px 0; color: #2c3e50; }
    .method { padding: 8px; margin: 5px 0; border-left: 3px solid #3498db; background: #ecf0f1; }
    .method-name { font-weight: bold; color: #2980b9; }
    .http-method { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; margin-right: 10px; }
    .GET { background: #61affe; color: white; }
    .POST { background: #49cc90; color: white; }
    .PUT { background: #fca130; color: white; }
    .PATCH { background: #50e3c2; color: white; }
    .DELETE { background: #f93e3e; color: white; }
    .path { color: #555; font-family: monospace; }
    .params { color: #7f8c8d; font-size: 14px; margin-top: 5px; }
    .summary { background: #3498db; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>🔍 API Structure - Księgarnia Backend</h1>
  
  <div class="summary">
    <strong>Podsumowanie:</strong><br>
    Kontrolery: ${controllers.length} | 
    Serwisy: ${services.length} | 
    Endpointy: ${controllers.reduce((sum, c) => sum + c.methods.length, 0)}
  </div>

  <h2>📡 Kontrolery (Endpointy API)</h2>
  ${controllers.map(ctrl => `
    <div class="controller">
      <h3>${ctrl.name}</h3>
      <div class="path">Base path: ${ctrl.path}</div>
      ${ctrl.methods.map(method => `
        <div class="method">
          <span class="http-method ${method.httpMethod}">${method.httpMethod}</span>
          <span class="method-name">${method.name}()</span>
          <div class="path">→ ${method.fullPath}</div>
          ${method.parameters.length > 0 ? `<div class="params">Parametry: ${method.parameters.join(', ')}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `).join('')}

  <h2>⚙️ Serwisy (Logika biznesowa)</h2>
  ${services.map(svc => `
    <div class="service">
      <h3>${svc.name}</h3>
      ${svc.methods.map((method) => `
        <div class="method">
          <span class="method-name">${method.name}()</span>
          ${method.async ? ' <span style="color: #e74c3c; font-size: 12px;">[async]</span>' : ''}
          ${method.parameters.length > 0 ? `<div class="params">Parametry: ${method.parameters.join(', ')}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `).join('')}

</body>
</html>
    `;
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
};
exports.ReflectionController = ReflectionController;
__decorate([
    (0, common_1.Get)('controllers'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReflectionController.prototype, "getControllers", null);
__decorate([
    (0, common_1.Get)('services'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReflectionController.prototype, "getServices", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReflectionController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('html'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReflectionController.prototype, "getHtml", null);
exports.ReflectionController = ReflectionController = __decorate([
    (0, common_1.Controller)('api-structure'),
    __metadata("design:paramtypes", [reflection_service_1.ReflectionService])
], ReflectionController);

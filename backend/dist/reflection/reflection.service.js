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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const constants_1 = require("@nestjs/common/constants");
let ReflectionService = class ReflectionService {
    constructor(discoveryService, metadataScanner, reflector) {
        this.discoveryService = discoveryService;
        this.metadataScanner = metadataScanner;
        this.reflector = reflector;
    }
    getApiStructure() {
        const controllers = this.discoveryService
            .getControllers()
            .filter((wrapper) => wrapper && wrapper.metatype);
        return controllers.map((wrapper) => {
            const { instance, metatype } = wrapper;
            if (!instance || !metatype)
                return null;
            const prototype = Object.getPrototypeOf(instance);
            const controllerPath = this.reflector.get(constants_1.PATH_METADATA, metatype) || '';
            const methodNames = this.metadataScanner.getAllMethodNames(prototype);
            const methods = methodNames
                .map((methodName) => {
                const method = prototype[methodName];
                const path = this.reflector.get(constants_1.PATH_METADATA, method) || '';
                const httpMethod = this.reflector.get(constants_1.METHOD_METADATA, method);
                if (!httpMethod)
                    return null;
                // Konwertuj httpMethod na string
                const httpMethodStr = typeof httpMethod === 'string'
                    ? httpMethod
                    : String(httpMethod);
                // Pobierz parametry metody
                const methodStr = method.toString();
                const paramsMatch = methodStr.match(/\(([^)]*)\)/);
                const params = paramsMatch
                    ? paramsMatch[1].split(',').map((p) => p.trim()).filter((p) => p)
                    : [];
                return {
                    name: methodName,
                    httpMethod: httpMethodStr.toUpperCase(),
                    path: path,
                    fullPath: `/${controllerPath}${path ? '/' + path : ''}`.replace(/\/+/g, '/'),
                    parameters: params,
                };
            })
                .filter((method) => method !== null);
            return {
                name: metatype.name,
                path: `/${controllerPath}`,
                methods,
            };
        }).filter((ctrl) => ctrl !== null);
    }
    getServiceStructure() {
        const providers = this.discoveryService
            .getProviders()
            .filter((wrapper) => {
            return wrapper &&
                wrapper.metatype &&
                wrapper.name &&
                wrapper.name.endsWith('Service') &&
                !wrapper.name.includes('Prisma') &&
                !wrapper.name.includes('Reflection');
        });
        return providers.map((wrapper) => {
            const { instance, metatype } = wrapper;
            if (!instance || !metatype)
                return null;
            const prototype = Object.getPrototypeOf(instance);
            const methodNames = this.metadataScanner.getAllMethodNames(prototype);
            const methods = methodNames.map((methodName) => {
                const method = prototype[methodName];
                const methodStr = method.toString();
                // Próba wyciągnięcia parametrów
                const paramsMatch = methodStr.match(/\(([^)]*)\)/);
                const params = paramsMatch
                    ? paramsMatch[1].split(',').map((p) => p.trim()).filter((p) => p && p !== '')
                    : [];
                // Sprawdź czy metoda jest async
                const isAsync = methodStr.startsWith('async ') || method.constructor.name === 'AsyncFunction';
                return {
                    name: methodName,
                    async: isAsync,
                    parameters: params,
                };
            });
            return {
                name: metatype.name,
                methods,
            };
        }).filter((svc) => svc !== null);
    }
};
exports.ReflectionService = ReflectionService;
exports.ReflectionService = ReflectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.MetadataScanner,
        core_1.Reflector])
], ReflectionService);

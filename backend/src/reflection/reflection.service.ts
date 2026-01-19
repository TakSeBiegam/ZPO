import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';

interface MethodInfo {
  name: string;
  httpMethod: string;
  path: string;
  fullPath: string;
  parameters: string[];
}

interface ControllerInfo {
  name: string;
  path: string;
  methods: MethodInfo[];
}

@Injectable()
export class ReflectionService {
  constructor(
    private discoveryService: DiscoveryService,
    private metadataScanner: MetadataScanner,
    private reflector: Reflector,
  ) {}

  getApiStructure(): ControllerInfo[] {
    const controllers = this.discoveryService
      .getControllers()
      .filter((wrapper: InstanceWrapper) => wrapper && wrapper.metatype);

    return controllers.map((wrapper: InstanceWrapper) => {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) return null;

      const prototype = Object.getPrototypeOf(instance);
      const controllerPath = this.reflector.get(PATH_METADATA, metatype) || '';
      
      const methodNames = this.metadataScanner.getAllMethodNames(prototype);
      
      const methods: MethodInfo[] = methodNames
        .map((methodName) => {
          const method = prototype[methodName];
          const path = this.reflector.get(PATH_METADATA, method) || '';
          const httpMethod = this.reflector.get(METHOD_METADATA, method);
          
          if (!httpMethod) return null;

          // Konwertuj httpMethod na string
          const httpMethodStr = typeof httpMethod === 'string' 
            ? httpMethod 
            : String(httpMethod);

          // Pobierz parametry metody
          const methodStr = method.toString();
          const paramsMatch = methodStr.match(/\(([^)]*)\)/);
          const params = paramsMatch 
            ? paramsMatch[1].split(',').map((p: string) => p.trim()).filter((p: string) => p)
            : [];

          return {
            name: methodName,
            httpMethod: httpMethodStr.toUpperCase(),
            path: path,
            fullPath: `/${controllerPath}${path ? '/' + path : ''}`.replace(/\/+/g, '/'),
            parameters: params,
          };
        })
        .filter((method): method is MethodInfo => method !== null);

      return {
        name: metatype.name,
        path: `/${controllerPath}`,
        methods,
      };
    }).filter((ctrl): ctrl is ControllerInfo => ctrl !== null);
  }

  getServiceStructure(): any[] {
    const providers = this.discoveryService
      .getProviders()
      .filter((wrapper: InstanceWrapper) => {
        return wrapper && 
               wrapper.metatype && 
               wrapper.name && 
               wrapper.name.endsWith('Service') &&
               !wrapper.name.includes('Prisma') &&
               !wrapper.name.includes('Reflection');
      });

    return providers.map((wrapper: InstanceWrapper) => {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) return null;

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = this.metadataScanner.getAllMethodNames(prototype);

      const methods = methodNames.map((methodName) => {
        const method = prototype[methodName];
        const methodStr = method.toString();
        
        // Próba wyciągnięcia parametrów
        const paramsMatch = methodStr.match(/\(([^)]*)\)/);
        const params = paramsMatch 
          ? paramsMatch[1].split(',').map((p: string) => p.trim()).filter((p: string) => p && p !== '')
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
    }).filter((svc): svc is any => svc !== null);
  }
}

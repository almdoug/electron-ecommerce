import { PrismaClient } from '@prisma/client';
import { 
  CalculateShippingInput, 
  ShippingCalculationResponse, 
  ZipCodeValidationInput, 
  ZipCodeValidationResponse,
  FreeShippingRuleInput,
  FreeShippingRuleResponse,
  ShippingServiceType
} from './shipping.schema';
import axios from 'axios';

const prisma = new PrismaClient();

/**
 * Serviço responsável pelo cálculo de frete, integrações com APIs externas e gerenciamento
 * de regras de frete grátis
 */
export class ShippingService {
  /**
   * Valida um CEP e retorna informações de endereço
   */
  async validateZipCode(input: ZipCodeValidationInput): Promise<ZipCodeValidationResponse> {
    try {
      // Remove caracteres não numéricos do CEP
      const cleanZipCode = input.zipCode.replace(/\D/g, '');
      
      // Consulta a API ViaCEP para validar o CEP e obter informações do endereço
      const response = await axios.get(`https://viacep.com.br/ws/${cleanZipCode}/json/`);
      
      if (response.data.erro) {
        return {
          valid: false,
          zipCode: input.zipCode
        };
      }
      
      return {
        valid: true,
        zipCode: input.zipCode,
        address: {
          street: response.data.logradouro,
          neighborhood: response.data.bairro,
          city: response.data.localidade,
          state: response.data.uf
        }
      };
    } catch (error) {
      console.error('Erro ao validar CEP:', error);
      return {
        valid: false,
        zipCode: input.zipCode
      };
    }
  }

  /**
   * Calcula opções de frete para um destino e conjunto de itens
   */
  async calculateShipping(input: CalculateShippingInput): Promise<ShippingCalculationResponse> {
    try {
      // 1. Obtem informações completas dos produtos
      const productIds = input.items.map(item => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
      });

      if (products.length !== productIds.length) {
        throw new Error('Alguns produtos não foram encontrados');
      }

      // 2. Calcula o peso total e valor do pedido
      let totalWeight = 0;
      let orderValue = 0;
      let totalItems = 0;
      const productCategories = new Set<string>();

      input.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          // Assume que cada produto tem 0.5kg por padrão
          const productWeight = 0.5; 
          totalWeight += productWeight * item.quantity;
          
          // Calcula o valor considerando possíveis descontos
          const price = product.discountedPrice !== null ? Number(product.discountedPrice) : Number(product.price);
          orderValue += price * item.quantity;
          
          totalItems += item.quantity;
          
          // Adiciona a categoria do produto ao conjunto
          if (product.category) {
            productCategories.add(product.category);
          }
        }
      });

      // 3. Validar e obter informações do CEP de destino
      const zipCodeInfo = await this.validateZipCode({ zipCode: input.zipCode });
      
      if (!zipCodeInfo.valid) {
        throw new Error('CEP inválido');
      }

      // 4. Verificar regras de frete grátis
      const freeShippingRules = await this.getFreeShippingRules();
      const applicableRules = await this.getApplicableRules(
        orderValue, 
        zipCodeInfo.address?.state || '', 
        Array.from(productCategories)
      );

      // 5. Obter serviços de frete disponíveis (integrando com APIs externas)
      const shippingServices = await this.getShippingServices(
        input.zipCode, 
        totalWeight,
        totalItems
      );

      // 6. Aplicar regras de frete grátis aos serviços disponíveis
      const processedServices = this.applyFreeShippingRules(
        shippingServices, 
        applicableRules
      );

      // 7. Montar a resposta
      return {
        destination: {
          zipCode: input.zipCode,
          city: zipCodeInfo.address?.city,
          state: zipCodeInfo.address?.state
        },
        availableServices: processedServices,
        totalWeight,
        totalItems,
        freeShippingEligible: processedServices.some(service => service.isFree)
      };
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      throw error;
    }
  }

  /**
   * Consulta serviços de frete disponíveis para o CEP de destino
   * Neste exemplo, simulamos a integração com APIs de diferentes transportadoras
   */
  private async getShippingServices(
    destinationZipCode: string, 
    totalWeight: number,
    totalItems: number
  ) {
    try {
      // Neste exemplo, estamos simulando a resposta de APIs de frete
      // Em um caso real, você faria chamadas para as APIs dos Correios ou outras transportadoras
      
      // Simular atraso da API
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Mock de preços para diferentes serviços
      const basicPrice = Math.max(15, totalWeight * 5); // R$ 5 por kg, mínimo de R$ 15
      
      const services = [
        {
          serviceType: ShippingServiceType.PAC,
          price: basicPrice,
          deliveryTimeInDays: 7,
          isFree: false,
          discountApplied: false
        },
        {
          serviceType: ShippingServiceType.SEDEX,
          price: basicPrice * 1.5, // 50% mais caro que PAC
          deliveryTimeInDays: 3,
          isFree: false,
          discountApplied: false
        },
        {
          serviceType: ShippingServiceType.SEDEX_10,
          price: basicPrice * 2.5, // 150% mais caro que PAC
          deliveryTimeInDays: 1,
          isFree: false,
          discountApplied: false
        }
      ];
      
      // Adicionar opção de retirada na loja se for na mesma cidade
      // (simplificação: CEPs iniciados com '01' são considerados da mesma cidade)
      if (destinationZipCode.startsWith('01')) {
        services.push({
          serviceType: ShippingServiceType.PICK_UP,
          price: 0,
          deliveryTimeInDays: 1,
          isFree: true,
          discountApplied: false
        });
      }
      
      return services;
      
    } catch (error) {
      console.error('Erro ao obter serviços de frete:', error);
      // Retorna serviços básicos em caso de falha
      return [
        {
          serviceType: ShippingServiceType.PAC,
          price: 20,
          deliveryTimeInDays: 7,
          isFree: false,
          discountApplied: false
        }
      ];
    }
  }
  
  /**
   * Obtém todas as regras de frete grátis ativas
   */
  async getFreeShippingRules() {
    const rules = await prisma.freeShippingRule.findMany({
      where: { active: true }
    });
    
    // Converter dados do Prisma para o formato esperado
    return rules.map(rule => ({
      id: rule.id,
      name: rule.name,
      description: rule.description || undefined,
      minOrderValue: Number(rule.minOrderValue),
      regions: rule.regions,
      productCategories: rule.productCategories,
      serviceTypes: rule.serviceTypes as ShippingServiceType[],
      active: rule.active,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt
    }));
  }
  
  /**
   * Filtra as regras aplicáveis com base no valor do pedido, região e categorias
   */
  private async getApplicableRules(orderValue: number, state: string, categories: string[]) {
    const rules = await prisma.freeShippingRule.findMany({
      where: {
        active: true,
        minOrderValue: { lte: orderValue },
        OR: [
          { regions: { has: state } },
          { regions: { isEmpty: true } },
          { productCategories: { hasSome: categories } }
        ]
      }
    });
    
    // Converter dados do Prisma para o formato esperado
    return rules.map(rule => ({
      id: rule.id,
      name: rule.name,
      description: rule.description || undefined,
      minOrderValue: Number(rule.minOrderValue),
      regions: rule.regions,
      productCategories: rule.productCategories,
      serviceTypes: rule.serviceTypes as ShippingServiceType[],
      active: rule.active,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt
    }));
  }
  
  /**
   * Aplica as regras de frete grátis aos serviços disponíveis
   */
  private applyFreeShippingRules(services: any[], rules: any[]) {
    // Se não há regras aplicáveis, retorna os serviços sem modificações
    if (rules.length === 0) return services;
    
    // Copia os serviços para não modificar o array original
    return services.map(service => {
      const serviceCopy = { ...service };
      
      // Verifica se alguma regra se aplica a este tipo de serviço
      const applicableRule = rules.find(rule => {
        // Se a regra não especifica tipos de serviço, ela se aplica a todos
        if (!rule.serviceTypes || rule.serviceTypes.length === 0) {
          return true;
        }
        // Caso contrário, verifica se o tipo de serviço está na lista da regra
        return rule.serviceTypes.includes(service.serviceType);
      });
      
      // Se encontrou uma regra aplicável, torna o frete grátis
      if (applicableRule) {
        serviceCopy.originalPrice = service.price;
        serviceCopy.price = 0;
        serviceCopy.isFree = true;
        serviceCopy.discountApplied = true;
      }
      
      return serviceCopy;
    });
  }
  
  /**
   * Cria uma nova regra de frete grátis
   */
  async createFreeShippingRule(data: FreeShippingRuleInput): Promise<FreeShippingRuleResponse> {
    const rule = await prisma.freeShippingRule.create({
      data
    });
    
    // Converter dados do Prisma para o formato esperado
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description || undefined,
      minOrderValue: Number(rule.minOrderValue),
      regions: rule.regions,
      productCategories: rule.productCategories,
      serviceTypes: rule.serviceTypes as ShippingServiceType[],
      active: rule.active,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt
    };
  }
  
  /**
   * Atualiza uma regra de frete grátis existente
   */
  async updateFreeShippingRule(id: string, data: Partial<FreeShippingRuleInput>): Promise<FreeShippingRuleResponse> {
    const rule = await prisma.freeShippingRule.update({
      where: { id },
      data
    });
    
    // Converter dados do Prisma para o formato esperado
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description || undefined,
      minOrderValue: Number(rule.minOrderValue),
      regions: rule.regions,
      productCategories: rule.productCategories,
      serviceTypes: rule.serviceTypes as ShippingServiceType[],
      active: rule.active,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt
    };
  }
  
  /**
   * Remove uma regra de frete grátis
   */
  async deleteFreeShippingRule(id: string): Promise<void> {
    await prisma.freeShippingRule.delete({
      where: { id }
    });
  }
  
  /**
   * Obtém uma regra de frete grátis pelo ID
   */
  async getFreeShippingRule(id: string): Promise<FreeShippingRuleResponse | null> {
    const rule = await prisma.freeShippingRule.findUnique({
      where: { id }
    });
    
    if (!rule) return null;
    
    // Converter dados do Prisma para o formato esperado
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description || undefined,
      minOrderValue: Number(rule.minOrderValue),
      regions: rule.regions,
      productCategories: rule.productCategories,
      serviceTypes: rule.serviceTypes as ShippingServiceType[],
      active: rule.active,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt
    };
  }
  
  /**
   * Lista todas as regras de frete grátis
   */
  async listFreeShippingRules(): Promise<FreeShippingRuleResponse[]> {
    const rules = await prisma.freeShippingRule.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Converter dados do Prisma para o formato esperado
    return rules.map(rule => ({
      id: rule.id,
      name: rule.name,
      description: rule.description || undefined,
      minOrderValue: Number(rule.minOrderValue),
      regions: rule.regions,
      productCategories: rule.productCategories,
      serviceTypes: rule.serviceTypes as ShippingServiceType[],
      active: rule.active,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt
    }));
  }
} 
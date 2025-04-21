import { FastifyReply, FastifyRequest } from 'fastify';
import { ShippingService } from './shipping.service';
import { 
  CalculateShippingInput, 
  ZipCodeValidationInput,
  FreeShippingRuleInput
} from './shipping.schema';

const shippingService = new ShippingService();

/**
 * Validar um CEP e retornar informações de endereço
 */
export async function validateZipCodeHandler(
  request: FastifyRequest<{ Body: ZipCodeValidationInput }>,
  reply: FastifyReply
) {
  try {
    const result = await shippingService.validateZipCode(request.body);
    return reply.code(200).send(result);
  } catch (error) {
    console.error('Erro ao validar CEP:', error);
    return reply.code(500).send({ 
      message: 'Erro ao processar solicitação de validação de CEP'
    });
  }
}

/**
 * Calcular opções de frete disponíveis
 */
export async function calculateShippingHandler(
  request: FastifyRequest<{ Body: CalculateShippingInput }>,
  reply: FastifyReply
) {
  try {
    const result = await shippingService.calculateShipping(request.body);
    return reply.code(200).send(result);
  } catch (error: any) {
    console.error('Erro ao calcular frete:', error);
    
    if (error.message === 'CEP inválido') {
      return reply.code(400).send({ message: 'CEP inválido' });
    }
    
    if (error.message === 'Alguns produtos não foram encontrados') {
      return reply.code(400).send({ message: 'Alguns produtos não foram encontrados' });
    }
    
    return reply.code(500).send({ 
      message: 'Erro ao processar solicitação de cálculo de frete'
    });
  }
}

/**
 * Criar uma nova regra de frete grátis (Admin)
 */
export async function createFreeShippingRuleHandler(
  request: FastifyRequest<{ Body: FreeShippingRuleInput }>,
  reply: FastifyReply
) {
  try {
    // Verificar se o usuário é admin
    const user = request.user as any;
    if (user.role !== 'ADMIN') {
      return reply.code(403).send({ 
        message: 'Acesso negado. Apenas administradores podem gerenciar regras de frete grátis' 
      });
    }
    
    const newRule = await shippingService.createFreeShippingRule(request.body);
    return reply.code(201).send(newRule);
  } catch (error) {
    console.error('Erro ao criar regra de frete grátis:', error);
    return reply.code(500).send({
      message: 'Erro ao criar regra de frete grátis'
    });
  }
}

/**
 * Atualizar uma regra de frete grátis existente (Admin)
 */
export async function updateFreeShippingRuleHandler(
  request: FastifyRequest<{ 
    Params: { ruleId: string },
    Body: Partial<FreeShippingRuleInput>
  }>,
  reply: FastifyReply
) {
  try {
    // Verificar se o usuário é admin
    const user = request.user as any;
    if (user.role !== 'ADMIN') {
      return reply.code(403).send({ 
        message: 'Acesso negado. Apenas administradores podem gerenciar regras de frete grátis' 
      });
    }
    
    const { ruleId } = request.params;
    
    // Verificar se a regra existe
    const existingRule = await shippingService.getFreeShippingRule(ruleId);
    if (!existingRule) {
      return reply.code(404).send({ message: 'Regra de frete grátis não encontrada' });
    }
    
    const updatedRule = await shippingService.updateFreeShippingRule(ruleId, request.body);
    return reply.send(updatedRule);
  } catch (error) {
    console.error('Erro ao atualizar regra de frete grátis:', error);
    return reply.code(500).send({
      message: 'Erro ao atualizar regra de frete grátis'
    });
  }
}

/**
 * Excluir uma regra de frete grátis (Admin)
 */
export async function deleteFreeShippingRuleHandler(
  request: FastifyRequest<{ Params: { ruleId: string } }>,
  reply: FastifyReply
) {
  try {
    // Verificar se o usuário é admin
    const user = request.user as any;
    if (user.role !== 'ADMIN') {
      return reply.code(403).send({ 
        message: 'Acesso negado. Apenas administradores podem gerenciar regras de frete grátis' 
      });
    }
    
    const { ruleId } = request.params;
    
    // Verificar se a regra existe
    const existingRule = await shippingService.getFreeShippingRule(ruleId);
    if (!existingRule) {
      return reply.code(404).send({ message: 'Regra de frete grátis não encontrada' });
    }
    
    await shippingService.deleteFreeShippingRule(ruleId);
    return reply.code(204).send();
  } catch (error) {
    console.error('Erro ao excluir regra de frete grátis:', error);
    return reply.code(500).send({
      message: 'Erro ao excluir regra de frete grátis'
    });
  }
}

/**
 * Obter uma regra de frete grátis específica
 */
export async function getFreeShippingRuleHandler(
  request: FastifyRequest<{ Params: { ruleId: string } }>,
  reply: FastifyReply
) {
  try {
    const { ruleId } = request.params;
    const rule = await shippingService.getFreeShippingRule(ruleId);
    
    if (!rule) {
      return reply.code(404).send({ message: 'Regra de frete grátis não encontrada' });
    }
    
    return reply.send(rule);
  } catch (error) {
    console.error('Erro ao obter regra de frete grátis:', error);
    return reply.code(500).send({
      message: 'Erro ao obter regra de frete grátis'
    });
  }
}

/**
 * Listar todas as regras de frete grátis
 */
export async function listFreeShippingRulesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const rules = await shippingService.listFreeShippingRules();
    return reply.send(rules);
  } catch (error) {
    console.error('Erro ao listar regras de frete grátis:', error);
    return reply.code(500).send({
      message: 'Erro ao listar regras de frete grátis'
    });
  }
} 
import { FastifyReply, FastifyRequest } from 'fastify';
import { 
  createPayment, 
  processPayment, 
  confirmPayment, 
  cancelPayment, 
  getPaymentById, 
  getPaymentByOrderId,
  handleStripeWebhook
} from './payment.service';
import { CreatePaymentInput, ProcessPaymentInput, WebhookEvent } from './payment.schema';
import { PaymentStatus } from '@prisma/client';

// Criar um registro de pagamento
export async function createPaymentHandler(
  request: FastifyRequest<{
    Body: CreatePaymentInput;
  }>,
  reply: FastifyReply
) {
  try {
    const payment = await createPayment(request.body);
    return reply.code(201).send(payment);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Processar um pagamento via Stripe
export async function processPaymentHandler(
  request: FastifyRequest<{
    Body: ProcessPaymentInput;
  }>,
  reply: FastifyReply
) {
  try {
    const result = await processPayment(request.body);
    return reply.code(200).send(result);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Endpoint para webhook do Stripe
export async function stripeWebhookHandler(
  request: FastifyRequest<{
    Body: WebhookEvent;
  }>,
  reply: FastifyReply
) {
  try {
    await handleStripeWebhook(request.body);
    return reply.code(200).send({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook do Stripe:', error);
    return reply.code(400).send({ received: false });
  }
}

// Confirmar pagamento manualmente (para testes ou administrativo)
export async function confirmPaymentHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const payment = await getPaymentById(id);
    
    if (!payment || !payment.stripePaymentId) {
      return reply.code(404).send({ message: 'Pagamento não encontrado ou sem ID do Stripe' });
    }
    
    const updatedPayment = await confirmPayment(payment.stripePaymentId, PaymentStatus.COMPLETED);
    return reply.code(200).send(updatedPayment);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Cancelar um pagamento
export async function cancelPaymentHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const payment = await cancelPayment(id);
    return reply.code(200).send(payment);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Buscar um pagamento pelo ID
export async function getPaymentHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const payment = await getPaymentById(id);
    
    if (!payment) {
      return reply.code(404).send({ message: 'Pagamento não encontrado' });
    }
    
    return reply.code(200).send(payment);
  } catch (error) {
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Buscar um pagamento pelo ID do pedido
export async function getPaymentByOrderHandler(
  request: FastifyRequest<{
    Params: {
      orderId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { orderId } = request.params;
    const payment = await getPaymentByOrderId(orderId);
    
    if (!payment) {
      return reply.code(404).send({ message: 'Pagamento não encontrado' });
    }
    
    return reply.code(200).send(payment);
  } catch (error) {
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
} 
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import { CreatePaymentInput, ProcessPaymentInput, PaymentResponse, StripeIntentResponse } from './payment.schema';
import { prisma } from '../../utils/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any, // Use a versão disponível
});

// Verificar se um pedido existe
async function orderExists(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Pedido não encontrado');
  }

  return order;
}

// Cria um registro de pagamento
export async function createPayment(input: CreatePaymentInput): Promise<PaymentResponse> {
  // Verifica se o pedido existe
  const order = await orderExists(input.orderId);

  // Verifica se já existe um pagamento para este pedido
  const existingPayment = await prisma.payment.findUnique({
    where: { orderId: input.orderId },
  });

  if (existingPayment) {
    throw new Error('Já existe um pagamento para este pedido');
  }

  // Cria o registro de pagamento
  const payment = await prisma.payment.create({
    data: {
      orderId: input.orderId,
      amount: order.total,
      paymentMethod: input.paymentMethod,
      status: PaymentStatus.PENDING,
    },
  });

  return payment as unknown as PaymentResponse;
}

// Processa um pagamento via Stripe
export async function processPayment(input: ProcessPaymentInput): Promise<StripeIntentResponse> {
  // Verifica se o pedido existe
  const order = await orderExists(input.orderId);

  // Busca ou cria o registro de pagamento
  let payment = await prisma.payment.findUnique({
    where: { orderId: input.orderId },
  });

  if (!payment) {
    payment = await prisma.payment.create({
      data: {
        orderId: input.orderId,
        amount: order.total,
        paymentMethod: input.paymentMethod,
        status: PaymentStatus.PROCESSING,
      },
    });
  } else {
    payment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentMethod: input.paymentMethod,
        status: PaymentStatus.PROCESSING,
      },
    });
  }

  // Converte o valor para centavos para o Stripe
  const amountInCents = Math.round(Number(order.total) * 100);

  try {
    // Cria o payment intent no Stripe de acordo com o método de pagamento
    let paymentIntent;

    switch (input.paymentMethod) {
      case PaymentMethod.CREDIT_CARD:
        paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'brl',
          payment_method_types: ['card'],
          metadata: {
            orderId: order.id,
            paymentId: payment.id,
          },
          description: `Pedido #${order.id}`,
        });
        break;

      case PaymentMethod.PIX:
        paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'brl',
          payment_method_types: ['pix'],
          metadata: {
            orderId: order.id,
            paymentId: payment.id,
          },
          description: `Pedido #${order.id}`,
        });
        break;

      case PaymentMethod.BOLETO:
        paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'brl',
          payment_method_types: ['boleto'],
          metadata: {
            orderId: order.id,
            paymentId: payment.id,
          },
          description: `Pedido #${order.id}`,
        });
        break;

      default:
        throw new Error('Método de pagamento não suportado');
    }

    // Atualiza o registro de pagamento com as informações do Stripe
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripePaymentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret,
      },
    });

    // Atualiza o pedido com o paymentIntentId
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentIntentId: paymentIntent.id,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret as string,
      paymentId: payment.id,
    };
  } catch (error) {
    // Atualiza o registro de pagamento com o erro
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
      },
    });

    throw error;
  }
}

// Confirma um pagamento após o webhook do Stripe
export async function confirmPayment(stripePaymentId: string, status: PaymentStatus, receiptUrl?: string): Promise<PaymentResponse> {
  // Busca o pagamento pelo ID do Stripe
  const payment = await prisma.payment.findFirst({
    where: { stripePaymentId },
  });

  if (!payment) {
    throw new Error('Pagamento não encontrado');
  }

  // Atualiza o status do pagamento
  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status,
      receiptUrl,
    },
  });

  // Se o pagamento foi concluído com sucesso, atualiza o status do pedido
  if (status === PaymentStatus.COMPLETED) {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: 'CONFIRMED',
      },
    });
  }

  return updatedPayment as unknown as PaymentResponse;
}

// Cancela um pagamento
export async function cancelPayment(paymentId: string): Promise<PaymentResponse> {
  // Busca o pagamento
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new Error('Pagamento não encontrado');
  }

  // Se tiver um paymentIntent no Stripe, cancela lá também
  if (payment.stripePaymentId) {
    try {
      await stripe.paymentIntents.cancel(payment.stripePaymentId);
    } catch (error) {
      console.error('Erro ao cancelar pagamento no Stripe:', error);
    }
  }

  // Atualiza o pagamento
  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.CANCELED,
    },
  });

  // Atualiza o pedido
  await prisma.order.update({
    where: { id: payment.orderId },
    data: {
      status: 'CANCELED',
    },
  });

  return updatedPayment as unknown as PaymentResponse;
}

// Busca um pagamento pelo ID
export async function getPaymentById(id: string): Promise<PaymentResponse | null> {
  const payment = await prisma.payment.findUnique({
    where: { id },
  });

  if (!payment) {
    return null;
  }

  return payment as unknown as PaymentResponse;
}

// Busca um pagamento pelo ID do pedido
export async function getPaymentByOrderId(orderId: string): Promise<PaymentResponse | null> {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (!payment) {
    return null;
  }

  return payment as unknown as PaymentResponse;
}

// Processa o evento de webhook do Stripe
export async function handleStripeWebhook(event: any): Promise<void> {
  const { type, data } = event;

  switch (type) {
    case 'payment_intent.succeeded':
      const paymentIntent = data.object;
      await confirmPayment(
        paymentIntent.id,
        PaymentStatus.COMPLETED,
        paymentIntent.charges?.data[0]?.receipt_url
      );
      break;

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = data.object;
      await confirmPayment(
        failedPaymentIntent.id,
        PaymentStatus.FAILED,
        undefined
      );
      break;

    default:
      console.log(`Evento do Stripe não processado: ${type}`);
  }
} 
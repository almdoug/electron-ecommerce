import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createProduct,
  findProductById,
  findProducts,
  updateProduct,
  updateProductStock,
  deleteProduct,
  addProductImage,
  deleteProductImage,
  findCategories,
  findFeaturedProducts
} from './product.service';
import { CreateProductInput, UpdateProductInput, UpdateStockInput, ProductFilterInput, UploadImageInput } from './product.schema';

// Cria um novo produto
export async function createProductHandler(
  request: FastifyRequest<{
    Body: CreateProductInput;
  }>,
  reply: FastifyReply
) {
  try {
    // Verificar se o usuário é admin
    const currentUser = request.user as { role: string };
    
    if (currentUser.role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Acesso negado. Apenas administradores podem criar produtos.' });
    }
    
    const product = await createProduct(request.body);
    return reply.code(201).send(product);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Obtém um produto pelo ID
export async function getProductHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const product = await findProductById(id);
    
    if (!product) {
      return reply.code(404).send({ message: 'Produto não encontrado' });
    }
    
    return reply.code(200).send(product);
  } catch (error) {
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Obtém produtos com filtros
export async function getProductsHandler(
  request: FastifyRequest<{
    Querystring: ProductFilterInput;
  }>,
  reply: FastifyReply
) {
  try {
    const filters = request.query;
    const result = await findProducts(filters);
    return reply.code(200).send(result);
  } catch (error) {
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Atualiza um produto
export async function updateProductHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: UpdateProductInput;
  }>,
  reply: FastifyReply
) {
  try {
    // Verificar se o usuário é admin
    const currentUser = request.user as { role: string };
    
    if (currentUser.role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Acesso negado. Apenas administradores podem atualizar produtos.' });
    }
    
    const { id } = request.params;
    const product = await updateProduct(id, request.body);
    return reply.code(200).send(product);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Atualiza o estoque de um produto
export async function updateProductStockHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: UpdateStockInput;
  }>,
  reply: FastifyReply
) {
  try {
    // Verificar se o usuário é admin
    const currentUser = request.user as { role: string };
    
    if (currentUser.role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Acesso negado. Apenas administradores podem atualizar o estoque.' });
    }
    
    const { id } = request.params;
    const product = await updateProductStock(id, request.body);
    return reply.code(200).send(product);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Exclui um produto
export async function deleteProductHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    // Verificar se o usuário é admin
    const currentUser = request.user as { role: string };
    
    if (currentUser.role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Acesso negado. Apenas administradores podem excluir produtos.' });
    }
    
    const { id } = request.params;
    await deleteProduct(id);
    return reply.code(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Adiciona uma imagem ao produto
export async function addProductImageHandler(
  request: FastifyRequest<{
    Body: UploadImageInput;
  }>,
  reply: FastifyReply
) {
  try {
    // Verificar se o usuário é admin
    const currentUser = request.user as { role: string };
    
    if (currentUser.role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Acesso negado. Apenas administradores podem adicionar imagens.' });
    }
    
    const image = await addProductImage(request.body);
    return reply.code(201).send(image);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Exclui uma imagem de produto
export async function deleteProductImageHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    // Verificar se o usuário é admin
    const currentUser = request.user as { role: string };
    
    if (currentUser.role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Acesso negado. Apenas administradores podem excluir imagens.' });
    }
    
    const { id } = request.params;
    await deleteProductImage(id);
    return reply.code(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Obtém categorias disponíveis
export async function getCategoriesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const categories = await findCategories();
    return reply.code(200).send(categories);
  } catch (error) {
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

// Obtém produtos em destaque
export async function getFeaturedProductsHandler(
  request: FastifyRequest<{
    Querystring: {
      limit?: number;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { limit } = request.query;
    const products = await findFeaturedProducts(limit);
    return reply.code(200).send(products);
  } catch (error) {
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
} 
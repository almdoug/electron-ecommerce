import { Product, ProductImage, Prisma } from '@prisma/client';
import { CreateProductInput, UpdateProductInput, UpdateStockInput, ProductFilterInput, UploadImageInput } from './product.schema';
import { prisma } from '../../utils/prisma';

// Verifica se um produto existe pelo ID
async function productExists(id: string): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    throw new Error('Produto não encontrado');
  }

  return product;
}

// Cria um novo produto
export async function createProduct(data: CreateProductInput): Promise<Product> {
  try {
    // Extrair imagens do input
    const { images, ...productData } = data;

    // Converter valores para o formato correto do Prisma
    const convertedProductData = {
      ...productData,
      price: new Prisma.Decimal(productData.price),
      discountedPrice: productData.discountedPrice ? new Prisma.Decimal(productData.discountedPrice) : null,
    };

    // Criar o produto com as imagens (se fornecidas)
    if (images && images.length > 0) {
      return prisma.product.create({
        data: {
          ...convertedProductData,
          images: {
            create: images
          }
        },
        include: {
          images: true
        }
      });
    } else {
      // Criar produto sem imagens
      return prisma.product.create({
        data: convertedProductData,
        include: {
          images: true
        }
      });
    }
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw new Error('Falha ao criar produto');
  }
}

// Busca um produto pelo ID
export async function findProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: true
    }
  });
}

// Busca todos os produtos com filtros
export async function findProducts(filters: ProductFilterInput): Promise<{
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const {
    title,
    category,
    minPrice,
    maxPrice,
    featured,
    inStock,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc'
  } = filters;

  // Construir condições de busca
  let where: Prisma.ProductWhereInput = {};

  // Filtrar por título (busca parcial)
  if (title) {
    where.title = {
      contains: title,
      mode: 'insensitive'
    };
  }

  // Filtrar por categoria
  if (category) {
    where.category = category;
  }

  // Filtrar por preço
  let priceFilter: Prisma.DecimalFilter = {};
  
  // Filtrar por preço mínimo
  if (minPrice !== undefined) {
    priceFilter.gte = new Prisma.Decimal(minPrice);
  }

  // Filtrar por preço máximo
  if (maxPrice !== undefined) {
    priceFilter.lte = new Prisma.Decimal(maxPrice);
  }
  
  // Aplicar filtro de preço apenas se houver alguma condição
  if (Object.keys(priceFilter).length > 0) {
    where.price = priceFilter;
  }

  // Filtrar por destacado
  if (featured !== undefined) {
    where.featured = featured;
  }

  // Filtrar por produtos em estoque
  if (inStock) {
    where.stock = {
      gt: 0
    };
  }

  // Calcular offset para paginação
  const skip = (page - 1) * limit;

  // Contar total de produtos que atendem aos filtros
  const total = await prisma.product.count({ where });

  // Buscar produtos com paginação e ordenação
  const products = await prisma.product.findMany({
    where,
    include: {
      images: true
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: order
    }
  });

  // Calcular total de páginas
  const totalPages = Math.ceil(total / limit);

  return {
    products,
    total,
    page,
    limit,
    totalPages
  };
}

// Atualiza um produto
export async function updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
  // Verificar se o produto existe
  await productExists(id);

  // Preparar dados para atualização
  const updateData: any = { ...data };

  // Converter valores para o formato correto do Prisma
  if (updateData.price !== undefined) {
    updateData.price = new Prisma.Decimal(updateData.price);
  }

  if (updateData.discountedPrice !== undefined) {
    updateData.discountedPrice = updateData.discountedPrice !== null
      ? new Prisma.Decimal(updateData.discountedPrice)
      : null;
  }

  // Atualizar produto
  return prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      images: true
    }
  });
}

// Atualiza o estoque de um produto
export async function updateProductStock(id: string, data: UpdateStockInput): Promise<Product> {
  // Verificar se o produto existe
  await productExists(id);

  // Atualizar estoque
  return prisma.product.update({
    where: { id },
    data: {
      stock: data.stock
    },
    include: {
      images: true
    }
  });
}

// Exclui um produto
export async function deleteProduct(id: string): Promise<void> {
  // Verificar se o produto existe
  await productExists(id);

  // Excluir produto (as imagens serão excluídas automaticamente pelo cascade)
  await prisma.product.delete({
    where: { id }
  });
}

// Adiciona uma imagem ao produto
export async function addProductImage(data: UploadImageInput): Promise<ProductImage> {
  // Verificar se o produto existe
  await productExists(data.productId);

  // Adicionar imagem
  return prisma.productImage.create({
    data: {
      url: data.url,
      productId: data.productId
    }
  });
}

// Exclui uma imagem de produto
export async function deleteProductImage(id: string): Promise<void> {
  // Verificar se a imagem existe
  const image = await prisma.productImage.findUnique({
    where: { id }
  });

  if (!image) {
    throw new Error('Imagem não encontrada');
  }

  // Verificar se o produto terá pelo menos uma imagem após a exclusão
  const imageCount = await prisma.productImage.count({
    where: { productId: image.productId }
  });

  if (imageCount <= 1) {
    throw new Error('Não é possível excluir a única imagem do produto');
  }

  // Excluir imagem
  await prisma.productImage.delete({
    where: { id }
  });
}

// Busca categorias disponíveis
export async function findCategories(): Promise<string[]> {
  const result = await prisma.product.groupBy({
    by: ['category']
  });

  return result.map(item => item.category);
}

// Busca produtos em destaque
export async function findFeaturedProducts(limit: number = 10): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      featured: true,
      stock: {
        gt: 0
      }
    },
    include: {
      images: true
    },
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  });
} 
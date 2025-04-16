/**
 * Composable para formatação de preços
 * Fornece funções para formatar valores monetários de forma consistente no aplicativo
 */
export const usePrice = () => {
    /**
     * Formata um valor numérico para o formato de moeda
     * @param price - O valor a ser formatado
     * @param locale - O locale a ser usado (padrão: 'en-US')
     * @param currency - A moeda a ser usada (padrão: 'USD')
     * @returns String formatada com o símbolo da moeda
     */
    const formatPrice = (price: number, locale = 'en-US', currency = 'USD') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(price);
    };

    /**
     * Calcula o percentual de desconto entre dois preços
     * @param originalPrice - Preço original
     * @param discountedPrice - Preço com desconto
     * @returns Percentual de desconto formatado (ex: "20%")
     */
    const calculateDiscount = (originalPrice: number, discountedPrice: number) => {
        if (!discountedPrice || discountedPrice >= originalPrice) return null;

        const discountPercentage = ((originalPrice - discountedPrice) / originalPrice) * 100;
        return `${Math.round(discountPercentage)}%`;
    };

    /**
     * Retorna o preço a ser exibido (com desconto, se disponível)
     * @param product - Produto com preço e possível preço com desconto
     * @returns O preço com desconto, se disponível, ou o preço normal
     */
    const getDisplayPrice = (product: { price: number, discountedPrice?: number }) => {
        return product.discountedPrice && product.discountedPrice < product.price
            ? product.discountedPrice
            : product.price;
    };

    return {
        formatPrice,
        calculateDiscount,
        getDisplayPrice
    };
}; 
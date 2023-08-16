class CaixaDaLanchonete {
  itemExistsInItens(itemCodigo, itens) {
    return itens.some((item) => item.split(",")[0] === itemCodigo);
  }

  checkExtraItems(itens, CARDAPIO) {
    let error = false;
    for (const input of itens) {
      const [codigo] = input.split(",");
      const item = CARDAPIO.find((item) => item.codigo === codigo);

      if (item && item.extra) {
        const principalItem = CARDAPIO.find(
          (principal) => item.itemPrincipal === principal.codigo
        );
        if (
          !principalItem ||
          !this.itemExistsInItens(principalItem.codigo, itens)
        ) {
          error = true;
          break;
        }
      }
    }

    return error;
  }

  validateQuantity(itens) {
    let error = false;
    for (const item of itens) {
      const quantity = item.split(",")[1];

      if (quantity <= 0) {
        error = true;
        break;
      }
    }
    return error;
  }

  validateItemsExistence(items, CARDAPIO) {
    let error = false;
    for (const itemPedido of items) {
      const [itemPedidoCodigo] = itemPedido.split(",");

      if (!this.itemExistsInCardapio(itemPedidoCodigo, CARDAPIO)) {
        error = true;
        break;
      }
    }

    return error;
  }

  itemExistsInCardapio(itemCodigo, CARDAPIO) {
    return CARDAPIO.some((item) => item.codigo === itemCodigo);
  }

  verifyPayment(formaDePagamento) {
    const paymentMethods = ["dinheiro", "debito", "credito"];
    return !paymentMethods.includes(formaDePagamento);
  }

  calculateValueMainItens(itens, CARDAPIO) {
    let valorTotal = 0;

    for (const itemPedido of itens) {
      const itemPedidoCodigo = itemPedido.split(",")[0];
      const itemPedidoQuantidade = Number(itemPedido.split(",")[1]);

      const itemCardapio = CARDAPIO.find(
        (item) => item.codigo === itemPedidoCodigo
      );

      if (
        itemCardapio.codigo !== "chantily" &&
        itemCardapio.codigo !== "queijo"
      ) {
        if (itemPedidoQuantidade === 0) {
          return "Quantidade inválida!";
        }

        valorTotal += itemCardapio.valor * itemPedidoQuantidade;
      }
    }
    return valorTotal;
  }

  calculateValueExtraItems(items, CARDAPIO) {
    const extraItemsTotal = items.reduce((total, itemPedido) => {
      const [itemPedidoCodigo, itemPedidoQuantidade] = itemPedido.split(",");

      const itemCardapio = CARDAPIO.find(
        (item) => item.codigo === itemPedidoCodigo
      );

      if (itemCardapio && itemCardapio.extra) {
        total += itemCardapio.valor * itemPedidoQuantidade;
      }

      return total;
    }, 0);

    return extraItemsTotal;
  }

  validatePaymentMethod(formaDePagamento, valorTotal) {
    const DESCONTO_DINHEIRO = 0.05;
    const TAXA_CREDITO = 0.03;

    if (formaDePagamento === "dinheiro") {
      valorTotal -= valorTotal * DESCONTO_DINHEIRO;
    } else if (formaDePagamento === "credito") {
      valorTotal += valorTotal * TAXA_CREDITO;
    }
    return valorTotal;
  }

  calcularValorDaCompra(formaDePagamento, itens) {
    const CARDAPIO = [
      { codigo: "cafe", descricao: "Café", valor: 3.0, extra: false },
      {
        codigo: "chantily",
        descricao: "Chantily (extra do Café)",
        valor: 1.5,
        extra: true,
        itemPrincipal: "cafe",
      },
      { codigo: "suco", descricao: "Suco Natural", valor: 6.2, extra: false },
      { codigo: "sanduiche", descricao: "Sanduíche", valor: 6.5, extra: false },
      {
        codigo: "queijo",
        descricao: "Queijo (extra do Sanduíche)",
        valor: 2.0,
        extra: true,
        itemPrincipal: "sanduiche",
      },
      { codigo: "salgado", descricao: "Salgado", valor: 7.25, extra: false },
      {
        codigo: "combo1",
        descricao: "1 Suco e 1 Sanduíche",
        valor: 9.5,
        extra: false,
      },
      {
        codigo: "combo2",
        descricao: "1 Café e 1 Sanduíche",
        valor: 7.5,
        extra: false,
      },
    ];
    if (itens.length === 0) {
      return "Não há itens no carrinho de compra!";
    }

    const verify = this.checkExtraItems(itens, CARDAPIO);
    if (verify) return "Item extra não pode ser pedido sem o principal";

    const validateItemsExistence = this.validateItemsExistence(itens, CARDAPIO);
    if (validateItemsExistence) return "Item inválido!";

    const validateQuantity = this.validateQuantity(itens);
    if (validateQuantity) return "Quantidade inválida!";

    const verifyPayment = this.verifyPayment(formaDePagamento);
    if (verifyPayment) return "Forma de pagamento inválida!";

    const valueMainItems = this.calculateValueMainItens(itens, CARDAPIO);
    const valueItemExtras = this.calculateValueExtraItems(itens, CARDAPIO);
    const totalValue = valueMainItems + valueItemExtras;
    const amount = this.validatePaymentMethod(formaDePagamento, totalValue);

    return `R$ ${amount.toFixed(2).replace(".", ",")}`;
  }
}

export { CaixaDaLanchonete };

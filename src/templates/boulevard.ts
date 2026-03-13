export const BOULEVARD_TEMPLATE = [
  ...Array.from({ length: 20 }).map((_, i) => ({
    location: `Andar ${String(i + 1).padStart(2, '0')}`,
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Caixas de passagem", "Lixeira", "Iluminação"]
  })),
  {
    location: "Hall L",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Caixas de passagem", "Lixeira", "Iluminação", "Janelas/portas"]
  },
  {
    location: "Academia",
    items: ["Limpeza piso", "Limpeza parede", "Limpeza espelhos", "Limpeza equipamentos", "Fissura parede/piso/teto", "Lixeira", "Iluminação", "Relógio"]
  },
  {
    location: "Banheiros piscina",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Lixeira", "Iluminação", "Bancadas", "Portas", "Vasos/pias"]
  },
  {
    location: "Sauna",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Lixeira", "Iluminação", "Bancadas", "Portas", "Pia/ducha", "Revestimentos"]
  },
  {
    location: "Piscinas",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso", "Lixeiras", "Iluminação", "Azulejos", "Espreguiçadeiras", "Mesas/cadeiras", "Plantas"]
  },
  {
    location: "Quadras",
    items: ["Piso", "Telas", "Placas", "Paredes"]
  },
  {
    location: "Quiosque 1",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Lixeira", "Iluminação", "Bancadas", "Portas", "Armários", "Utensílios", "Mesas/cadeiras", "Geladeira", "Cervejeira", "Tv", "Churrasqueira"]
  },
  {
    location: "Quiosque 2",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Lixeira", "Iluminação", "Bancadas", "Portas", "Armários", "Utensílios", "Mesas/cadeiras", "Cervejeira", "Tv", "Churrasqueira"]
  },
  {
    location: "Quiosque 3",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Lixeira", "Iluminação", "Bancadas", "Portas", "Armários", "Utensílios", "Mesas/cadeiras", "Cervejeira", "Tv", "Churrasqueira"]
  },
  {
    location: "Quiosque 4",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Lixeira", "Iluminação", "Bancadas", "Portas", "Armários", "Utensílios", "Mesas/cadeiras", "Geladeira", "Cervejeira", "Tv", "Churrasqueira"]
  },
  {
    location: "Quiosque 5",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Lixeira", "Iluminação", "Bancadas", "Armários", "Utensílios", "Mesas/cadeiras", "Cervejeira", "Churrasqueira"]
  },
  {
    location: "Quadra de Squash",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Portas"]
  },
  {
    location: "Salão gourmet",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Lixeira", "Iluminação", "Bancadas", "Portas", "Janelas", "Armários", "Utensílios", "Mesas/cadeiras", "Geladeira", "Cervejeira", "Tv e BTV", "Churrasqueira"]
  },
  {
    location: "Salão grande",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Portas", "Janelas"]
  },
  {
    location: "Cozinha salão grande",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Portas", "Janelas"]
  },
  {
    location: "Salão de Jogos",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Portas", "Janelas", "Mesa pingue pongue"]
  },
  {
    location: "Brinquedoteca",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Portas", "Janelas"]
  },
  {
    location: "Garagem G1",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Portas Elevadores", "Área de máquinas dos ar condicionados", "Lavanderia", "Vazamentos"]
  },
  {
    location: "Sala de bombas piscina",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Bombas", "Produtos"]
  },
  {
    location: "Garagem G2",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Portas Elevadores", "Sala sanear", "Vazamentos"]
  },
  {
    location: "Mercadinho",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação"]
  },
  {
    location: "Rampa de entrada",
    items: ["Eclusa", "Iluminação", "Grama", "Plantas", "Piso", "Caixa de gordura", "Caixa de esgoto"]
  },
  {
    location: "Recepção",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Portas Elevadores", "Sofás", "Quadros", "Balcão", "Computador", "Painéis MDF", "Porta de entrada/vidros", "Espelhos", "Circulador de ar"]
  },
  {
    location: "Administração",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Mesa/cadeiras", "Móveis MDF", "Achados e perdidos", "Computador"]
  },
  {
    location: "Zeladoria",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Gerador", "WAP", "Soprador", "Bandeirantes"]
  },
  {
    location: "Garagem G3",
    items: ["Limpeza piso", "Limpeza parede", "Fissura parede/piso/teto", "Iluminação", "Portas Elevadores", "Depósito de produtos", "Bomba pluvial", "Vazamentos"]
  },
  {
    location: "Espaço Pet",
    items: ["Grama", "Suporte de sacola", "Lixeira", "Plantas"]
  },
  {
    location: "Lateral interna G3",
    items: ["Grama", "Coqueiros"]
  }
];

export const getTemplate = (condoName: string) => {
  return BOULEVARD_TEMPLATE;
};
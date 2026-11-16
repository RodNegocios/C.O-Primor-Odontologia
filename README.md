# Primor Odontologia Especializada

Site institucional estático e responsivo, preparado para hospedagens com publicação de arquivos HTML/CSS/JS (incluindo planos de hospedagem estática na Hostinger).

## Executar

Abra `index.html` com um servidor HTTP estático (por exemplo `python -m http.server 8000`), ou envie o conteúdo deste repositório para a pasta pública de sua hospedagem. Não há etapa de build nem necessidade de processos Node.js.

## Recursos

- Hero utilizando `foto para capa da hero.png` em camadas: imagem de fundo, lettering PRIMOR e imagem dianteira com máscara CSS de contornos suaves.
- Galeria Accordion responsiva para os quatro serviços **confirmados no documento Informações**, com interação por mouse, toque e teclado.
- Scroll Stack nos três primeiros blocos após a hero, com CSS `position: sticky` e progressão de escala vinculada à rolagem natural da janela.
- Vídeo do repositório com autoplay silencioso, pausa fora da viewport, fallback visual, botão de controle, respeito a movimento reduzido e economia de dados.
- WhatsApp, Instagram, endereço, horários, mapa e dados estruturados SEO.

## Arquivos-chave

- `index.html`: estrutura, conteúdo e SEO.
- `styles.css`: identidade visual, breakpoints e camadas.
- `script.js`: navegação, interações, Scroll Stack e gerenciamento de mídia.
- Imagens e MP4 originais permanecem intactos na raiz.

## Limitações e itens para revisão

A foto de hero tem uma segunda instância recortada por **máscara elíptica gradual de CSS**. Isso cria o efeito de profundidade, mas **não é uma segmentação pixel a pixel do profissional**. Para um recorte com silhueta exata, substitua a máscara por um PNG/WebP com canal alfa do profissional, derivado e aprovado da foto original. Verifique o enquadramento da imagem na versão publicada.

A interpretação do conteúdo visual dos PNG e do MP4 não pôde ser validada por inspeção neste ambiente; confira o contexto e a distribuição da mídia em navegador. Não são exibidos resultados clínicos como promessas de eficácia; confirme autorização antes de publicar imagens de pacientes e eventuais comparativos de antes/depois. Revise também dados de CRO/responsável técnico e requisitos regulatórios aplicáveis.

A arquitetura foi escrita sem dependências externas obrigatórias de JavaScript, usando o comportamento visual de Accordion Gallery e Scroll Stack adaptado para HTML/CSS/JS nativos. Não utiliza React nem GSAP.

## Publicação

Aponte a raiz pública do domínio para a pasta contendo `index.html` e os ativos com seus nomes originais. Teste no navegador as larguras 320, 375, 390, 430, 768, 1024, 1440 e 1920 px antes de publicar.

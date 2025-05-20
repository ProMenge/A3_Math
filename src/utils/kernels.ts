export const kernels: Record<string, number[][]> = {
  // Filtro neutro (sem efeito)
  identity: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],

  // Desfoque leve (Box Blur 3x3)
  blur: [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ],

  // Realce de contraste
  sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],

  // Detecção de bordas
  edge: [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ],

  // Relevo horizontal 5x5 (emboss estilizado)
  emboss5x5: [
    [-2, -1, 0, 1, 2],
    [-2, -1, 0, 1, 2],
    [-2, -1, 0, 1, 2],
    [-2, -1, 0, 1, 2],
    [-2, -1, 0, 1, 2],
  ],

  // Desfoque mais amplo 5x5
  box5x5: Array(5).fill(Array(5).fill(1 / 25)),

  // Detecção de borda mais suave (Gaussiano 5x5)
  gaussian5x5: [
    [1, 4, 7, 4, 1],
    [4, 16, 26, 16, 4],
    [7, 26, 41, 26, 7],
    [4, 16, 26, 16, 4],
    [1, 4, 7, 4, 1],
  ].map((row) => row.map((v) => v / 273)),

  // Realce forte 5x5
  sharpen5x5: [
    [0, 0, -1, 0, 0],
    [0, -1, -2, -1, 0],
    [-1, -2, 16, -2, -1],
    [0, -1, -2, -1, 0],
    [0, 0, -1, 0, 0],
  ],

  // Detecção de contorno 7x7 (mais extrema)
  edge7x7: [
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, 0, 0, 0, -1, -1],
    [-1, -1, 0, 32, 0, -1, -1],
    [-1, -1, 0, 0, 0, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
  ],

  // Relevo em diagonal (efeito criativo)
  embossDiagonal: [
    [-1, -1, 0],
    [-1, 0, 1],
    [0, 1, 1],
  ],

  // Filtro experimental para "engrossar bordas"
  thickEdge: [
    [1, 1, 1],
    [1, -8, 1],
    [1, 1, 1],
  ],
};

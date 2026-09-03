export function generarContrasena(longitud = 12): string {
  const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minusculas = 'abcdefghijklmnopqrstuvwxyz';
  const numeros = '0123456789';
  const especiales = '!@#$%&*';
  const todos = mayusculas + minusculas + numeros + especiales;
  const contrasena = [
    mayusculas[Math.floor(Math.random() * mayusculas.length)],
    minusculas[Math.floor(Math.random() * minusculas.length)],
    numeros[Math.floor(Math.random() * numeros.length)],
    especiales[Math.floor(Math.random() * especiales.length)],
    ...Array.from({ length: longitud - 4 }, () =>
      todos[Math.floor(Math.random() * todos.length)]
    ),
  ];

  return contrasena.sort(() => Math.random() - 0.5).join('');
}
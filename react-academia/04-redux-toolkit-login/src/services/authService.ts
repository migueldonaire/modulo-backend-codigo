export type Usuario = {
  id: string;
  email: string;
  nombre: string;
  rol: "admin" | "alumno"; // solo uno de estos dos textos
};

type UsuarioGuardado = Usuario & { password: string }; // Usuario + password

// Login FALSO. Con una API de verdad sería un POST /auth/login que devuelve un JWT
export async function login(email: string, password: string): Promise<{ token: string; usuario: Usuario }> {
  const respuesta = await fetch(`http://localhost:3001/usuarios?email=${encodeURIComponent(email)}`);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}`);
  }
  const usuarios: UsuarioGuardado[] = await respuesta.json();
  const encontrado = usuarios.find((u) => u.password === password);
  if (!encontrado) {
    throw new Error("Email o contraseña incorrectos.");
  }
  // Sacamos la contraseña y nos quedamos con el resto
  const { password: _password, ...usuario } = encontrado;
  return { token: `token-falso-${usuario.id}`, usuario };
}

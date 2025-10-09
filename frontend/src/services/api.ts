import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  mensaje?: string;
  total?: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const usuarioService = {
  // Obtener todos los usuarios
  async getUsuarios(): Promise<Usuario[]> {
    const response = await api.get<ApiResponse<Usuario[]>>('/usuarios');
    return response.data.data || [];
  },

  // Obtener usuario por ID
  async getUsuario(id: number): Promise<Usuario> {
    const response = await api.get<ApiResponse<Usuario>>(`/usuarios/${id}`);
    if (!response.data.data) {
      throw new Error('Usuario no encontrado');
    }
    return response.data.data;
  },

  // Crear nuevo usuario
  async createUsuario(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    const response = await api.post<ApiResponse<Usuario>>('/usuarios', usuario);
    if (!response.data.data) {
      throw new Error('Error al crear usuario');
    }
    return response.data.data;
  },

  // Actualizar usuario
  async updateUsuario(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    const response = await api.put<ApiResponse<Usuario>>(`/usuarios/${id}`, usuario);
    if (!response.data.data) {
      throw new Error('Error al actualizar usuario');
    }
    return response.data.data;
  },

  // Eliminar usuario
  async deleteUsuario(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/usuarios/${id}`);
  },
};

export default api;
import React, { useState, useEffect } from 'react';
import { Usuario, usuarioService } from '../services/api';

const UsuarioManager: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<Omit<Usuario, 'id'>>({ 
    nombre: '', 
    email: '' 
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Cargar usuarios al iniciar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await usuarioService.getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre || !formData.email) {
      setError('Nombre y email son requeridos');
      return;
    }

    try {
      if (editingId) {
        // Actualizar usuario existente
        const usuarioActualizado = await usuarioService.updateUsuario(editingId, formData);
        setUsuarios(prev => prev.map(u => u.id === editingId ? usuarioActualizado : u));
        setEditingId(null);
      } else {
        // Crear nuevo usuario
        const nuevoUsuario = await usuarioService.createUsuario(formData);
        setUsuarios(prev => [...prev, nuevoUsuario]);
      }

      setFormData({ nombre: '', email: '' });
    } catch (err) {
      setError('Error al guardar usuario');
      console.error(err);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setFormData({ nombre: usuario.nombre, email: usuario.email });
    setEditingId(usuario.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await usuarioService.deleteUsuario(id);
      setUsuarios(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError('Error al eliminar usuario');
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setFormData({ nombre: '', email: '' });
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Gestión de Usuarios</h1>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
        )}

        <div>
          <button type="submit" style={{ marginRight: '10px', padding: '10px 20px' }}>
            {editingId ? 'Actualizar' : 'Crear'} Usuario
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} style={{ padding: '10px 20px' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de usuarios */}
      <div>
        <h2>Lista de Usuarios ({usuarios.length})</h2>
        
        {loading && <p>Cargando usuarios...</p>}
        
        {!loading && usuarios.length === 0 && (
          <p>No hay usuarios registrados</p>
        )}

        {usuarios.map(usuario => (
          <div key={usuario.id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            margin: '10px 0', 
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>{usuario.nombre}</h4>
              <p style={{ margin: 0, color: '#666' }}>{usuario.email}</p>
              {usuario.fechaCreacion && (
                <small style={{ color: '#999' }}>
                  Creado: {new Date(usuario.fechaCreacion).toLocaleDateString()}
                </small>
              )}
            </div>
            
            <div>
              <button 
                onClick={() => handleEdit(usuario)}
                style={{ marginRight: '10px', padding: '5px 10px' }}
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(usuario.id)}
                style={{ 
                  padding: '5px 10px', 
                  backgroundColor: '#ff4444', 
                  color: 'white',
                  border: 'none'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsuarioManager;
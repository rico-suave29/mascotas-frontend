import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://mascotas-backend-wk8u.onrender.com';

const SECCIONES = {
  clientes: { ruta: 'cliente', campos: ['nombre', 'apPaterno', 'apMaterno', 'email'], idCampo: 'idCliente', icon: '👤' },
  mascotas: { ruta: 'mascota', campos: ['nombre', 'tipo', 'sexo', 'edad', 'enPeligro'], idCampo: 'idMascota', icon: '🐾' },
  servicios: { ruta: 'servicio', campos: ['descripcion', 'precio'], idCampo: 'idServicio', icon: '🔧' },
  direcciones: { ruta: 'direccion', campos: ['calle', 'numero'], idCampo: 'idDireccion', icon: '📍' }
};

const styles = {
  app: { display: 'flex', minHeight: '100vh', background: '#0f0f1a', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif" },
  sidebar: { width: 240, background: '#1a1a2e', padding: '20px 0', display: 'flex', flexDirection: 'column' },
  logo: { padding: '20px 24px 30px', fontSize: 22, fontWeight: 700, color: '#7c6af7', borderBottom: '1px solid #2a2a3e' },
  navBtn: (active) => ({ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px', cursor: 'pointer', background: active ? '#2a2a4e' : 'transparent', color: active ? '#7c6af7' : '#aaa', border: 'none', width: '100%', textAlign: 'left', fontSize: 15, borderLeft: active ? '3px solid #7c6af7' : '3px solid transparent' }),
  main: { flex: 1, padding: 30, overflowY: 'auto' },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 },
  subtitle: { color: '#888', marginTop: 6 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 30 },
  statCard: (color) => ({ background: '#1a1a2e', borderRadius: 12, padding: 20, borderTop: `3px solid ${color}` }),
  statNum: { fontSize: 32, fontWeight: 700, color: '#fff' },
  statLabel: { color: '#888', marginTop: 4, fontSize: 14 },
  card: { background: '#1a1a2e', borderRadius: 12, padding: 24, marginBottom: 24 },
  cardTitle: { fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 20 },
  form: { display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  input: { padding: '10px 14px', background: '#0f0f1a', border: '1px solid #2a2a4e', borderRadius: 8, color: '#e0e0e0', fontSize: 14, minWidth: 160 },
  btnPrimary: { padding: '10px 20px', background: '#7c6af7', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  btnSecondary: { padding: '10px 20px', background: '#2a2a4e', color: '#aaa', border: 'none', borderRadius: 8, cursor: 'pointer', marginLeft: 8 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', color: '#7c6af7', borderBottom: '1px solid #2a2a4e', fontSize: 13, textTransform: 'uppercase' },
  td: { padding: '12px 16px', borderBottom: '1px solid #1f1f35', fontSize: 14 },
  btnEdit: { padding: '5px 12px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: 6, cursor: 'pointer', marginRight: 6, fontWeight: 600, fontSize: 12 },
  btnDelete: { padding: '5px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12 },
  badge: (val) => ({ padding: '3px 10px', borderRadius: 20, fontSize: 12, background: val ? '#14532d' : '#450a0a', color: val ? '#4ade80' : '#f87171' })
};

export default function App() {
  const [seccion, setSeccion] = useState('clientes');
  const [datos, setDatos] = useState([]);
  const [counts, setCounts] = useState({ clientes: 0, mascotas: 0, servicios: 0, direcciones: 0 });
  const [form, setForm] = useState({});
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarDatos();
    cargarCounts();
  }, [seccion]);

  const cargarDatos = () => {
    axios.get(`${API}/${SECCIONES[seccion].ruta}`)
      .then(r => setDatos(Array.isArray(r.data) ? r.data : []))
      .catch(() => setDatos([]));
  };

  const cargarCounts = () => {
    Object.entries(SECCIONES).forEach(([key, val]) => {
      axios.get(`${API}/${val.ruta}`).then(r => {
        setCounts(prev => ({ ...prev, [key]: Array.isArray(r.data) ? r.data.length : 0 }));
      }).catch(() => {});
    });
  };

  const guardar = () => {
    const ruta = SECCIONES[seccion].ruta;
    const req = editando ? axios.put(`${API}/${ruta}/${editando}`, form) : axios.post(`${API}/${ruta}`, form);
    req.then(() => { cargarDatos(); cargarCounts(); setForm({}); setEditando(null); });
  };

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar este registro?'))
      axios.delete(`${API}/${SECCIONES[seccion].ruta}/${id}`).then(() => { cargarDatos(); cargarCounts(); });
  };

  const editar = (item) => {
    setEditando(item[SECCIONES[seccion].idCampo]);
    setForm(item);
  };

  const colores = ['#7c6af7', '#06b6d4', '#f59e0b', '#ef4444'];

  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>🐾 VetSystem</div>
        {Object.entries(SECCIONES).map(([key, val]) => (
          <button key={key} style={styles.navBtn(seccion === key)} onClick={() => { setSeccion(key); setForm({}); setEditando(null); }}>
            <span style={{ fontSize: 20 }}>{val.icon}</span>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Sistema de gestión veterinaria</p>
        </div>

        <div style={styles.statsGrid}>
          {Object.entries(counts).map(([key, count], i) => (
            <div key={key} style={styles.statCard(colores[i])}>
              <div style={styles.statNum}>{count}</div>
              <div style={styles.statLabel}>{SECCIONES[key].icon} {key.charAt(0).toUpperCase() + key.slice(1)}</div>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>{editando ? '✏️ Editar' : '➕ Agregar'} {seccion}</div>
          <div style={styles.form}>
            {SECCIONES[seccion].campos.map(campo => (
              <input key={campo} placeholder={campo} value={form[campo] || ''}
                onChange={e => setForm({ ...form, [campo]: e.target.value })}
                style={styles.input} />
            ))}
          </div>
          <button onClick={guardar} style={styles.btnPrimary}>{editando ? 'Actualizar' : 'Guardar'}</button>
          {editando && <button onClick={() => { setForm({}); setEditando(null); }} style={styles.btnSecondary}>Cancelar</button>}
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>📋 Lista de {seccion}</div>
          {datos.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>No hay registros aún</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>{Object.keys(datos[0]).map(k => <th key={k} style={styles.th}>{k}</th>)}<th style={styles.th}>Acciones</th></tr>
              </thead>
              <tbody>
                {datos.map((item, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : '#15152a' }}>
                    {Object.entries(item).map(([k, v], j) => (
                      <td key={j} style={styles.td}>
                        {typeof v === 'boolean' ? <span style={styles.badge(v)}>{v ? 'Sí' : 'No'}</span> : String(v)}
                      </td>
                    ))}
                    <td style={styles.td}>
                      <button onClick={() => editar(item)} style={styles.btnEdit}>Editar</button>
                      <button onClick={() => eliminar(item[SECCIONES[seccion].idCampo])} style={styles.btnDelete}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
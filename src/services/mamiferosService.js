import { supabase } from '../config/supabaseClient';

export const obtenerMamiferos = async () => {
  try {
    // Pide a la tabla 'mamiferos' todas las columnas (*)
    const { data, error } = await supabase
      .from('mamiferos')
      .select('*');

    if (error) throw error;
    
    return data; // Retorna un array con los mamíferos
  } catch (error) {
    console.error('Error al obtener los mamiferos:', error.message);
    return []; // Retorna array vacío si hay error para no romper la app
  }
};
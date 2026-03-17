import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import loginReducer from '../pages/signin/slices/loginSlice';

// admin
import studentsReducer from '../pages/admin/slicesStudents/StudentsSlice';
import docentesReducer from '../pages/admin/slicesDocentes/DocentesSlice';
import cursoReducer from '../pages/admin/slicesCursos/CursosSlice';

// admin estudiantes
import perfilReducer from '../pages/adminEstudiantes/slicesPerfil/PerfilSlice';
import carritoReducer from '../pages/adminEstudiantes/slicesCarrito/CarritoSlice';
import ofertaAcademicaReducer from '../pages/adminEstudiantes/slicesOfertaAcademica/OfertaAcademicaSlice';
import cursosEstudianteReducer from '../pages/adminEstudiantes/slicesCursos/CursosSlice';
import checkoutReducer from '../pages/adminEstudiantes/slicesCheckout/CheckoutSlice';
import perfilDocenteReducer from '../pages/adminDocentes/slicesPerfilDocente/PerfilDocenteSlice';
const loginPersistConfig = {
  key: 'login',
  storage,
  whitelist: ['user'],
};

export const rootReducer = combineReducers({
  login: persistReducer(loginPersistConfig, loginReducer),

  // admin
  students: studentsReducer,
  docentes: docentesReducer,
  cursos: cursoReducer,

  // admin estudiantes
  perfil: perfilReducer,
  carrito: carritoReducer,
  ofertaAcademica: ofertaAcademicaReducer,
  cursosEstudiante: cursosEstudianteReducer,
  checkout: checkoutReducer,
  perfilDocente: perfilDocenteReducer,
});

export default rootReducer;
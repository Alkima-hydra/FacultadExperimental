import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import loginReducer from '../pages/signin/slices/loginSlice';

// admin
import studentsReducer from '../pages/admin/slicesStudents/StudentsSlice';
import docentesReducer from '../pages/admin/slicesDocentes/DocentesSlice';
import cursoReducer from '../pages/admin/slicesCursos/CursosSlice';
import pagosReducer from '../pages/admin/slicesPagos/PagosSlice';

// admin estudiantes
import perfilReducer from '../pages/adminEstudiantes/slicesPerfil/PerfilSlice';
import carritoReducer from '../pages/adminEstudiantes/slicesCarrito/CarritoSlice';
import ofertaAcademicaReducer from '../pages/adminEstudiantes/slicesOfertaAcademica/OfertaAcademicaSlice';
import cursosEstudianteReducer from '../pages/adminEstudiantes/slicesCursos/CursosSlice';
import checkoutReducer from '../pages/adminEstudiantes/slicesCheckout/CheckoutSlice';
import perfilDocenteReducer from '../pages/adminDocentes/slicesPerfilDocente/PerfilDocenteSlice';
// para que el estudiante vea su historial de saldos
import saldosMovimientosReducer from '../pages/adminEstudiantes/slicesSaldo/SaldosMovimientosSlice';
//admin para docente

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
  pagos: pagosReducer,

  // admin estudiantes
  perfil: perfilReducer,
  carrito: carritoReducer,
  ofertaAcademica: ofertaAcademicaReducer,
  cursosEstudiante: cursosEstudianteReducer,
  checkout: checkoutReducer,
  perfilDocente: perfilDocenteReducer,
  saldosMovimientos: saldosMovimientosReducer,
});

export default rootReducer;
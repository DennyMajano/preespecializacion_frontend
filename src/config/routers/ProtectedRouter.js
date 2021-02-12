// import React from 'react'
// import { Route, Redirect } from 'react-router-dom'
// // import Authentication from '../Services/Authentication'
// // import Encryption from '../Services/Encryption'
// // import HTTP from '../Services/HTTP'

// //Funcin para las rutas protegidas esta esta implementada para el desbloqueo de la session.
// const ProtectedRoute = ({ component: Component, ...rest }) => (

//     <Route
//         {...rest}

//         render={
//             props =>
//                 // evalua si existe login y si esta bloqueda la session
//                 Authentication.isLogin() === true && sessionStorage.getItem("timeout") ? (
//                     //Realiza un logout en el sistema
//                     HTTP.POST("auth/logout", null).then(response => {
//                         if (response !== false) {
//                             //Destruye el token
//                             Encryption.destroyItemSession("token")
//                         }
//                     }),

//                     //Renderiza el componete de desbloqueo
//                     <Component {...props} />
//                 ) : (
//                         //En caso contrario redireccina al home

//                         <Redirect to="/" />   // window.location.href = "/login"
//                     )
//         }

//     />

// );

// export default ProtectedRoute;
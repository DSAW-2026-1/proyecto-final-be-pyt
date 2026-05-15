const users = require("../models/userMemory");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


// ==========================
// REGISTER
// ==========================
const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;


    // validar correo institucional
    if (!email.endsWith("@unisabana.edu.co")) {

      return res.status(400).json({
        error: "Correo no institucional"
      });

    }


    // verificar si usuario ya existe
    const exist = users.find(
      u => u.email === email
    );

    if (exist) {

      return res.status(409).json({
        error: "Usuario ya existe"
      });

    }


    // encriptar contraseña
    const hashedPassword =
      await bcrypt.hash(password, 10);


    // definir rol
    const role =
      email === "admin@unisabana.edu.co"
        ? "admin"
        : "buyer";


    // crear usuario
    const newUser = {

      id: Date.now().toString(),

      name,

      email,

      password: hashedPassword,

      role,

      // SISTEMA VENDEDOR
      isSeller: false,

      sellerInfo: null,

      // CALIFICACIONES
      rating: null,

      totalSales: 0,

      reviews: [],

      cart: []

    };


    // guardar usuario
    users.push(newUser);


    // respuesta
    res.json({

      message: "Usuario registrado ✅",

      user: newUser

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error en servidor"
    });

  }

};


// ==========================
// LOGIN
// ==========================
const login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    // buscar usuario
    const user = users.find(
      u => u.email === email
    );


    if (!user) {

      return res.status(404).json({
        error: "Usuario no existe"
      });

    }


    // validar contraseña
    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!validPassword) {

      return res.status(401).json({
        error: "Credenciales inválidas"
      });

    }


    // generar token
    const token = jwt.sign(

      {
        id: user.id,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1h"
      }

    );


    // respuesta
    res.json({

      message: "Login exitoso ✅",

      token,

      user

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error en servidor"
    });

  }

};


module.exports = {
  register,
  login
};
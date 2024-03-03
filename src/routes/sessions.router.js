import express from "express";
import UserManager from "../dao/manager_mongo/userManager.js";

const um = new UserManager();
const router = express.Router();
const userCoderAdmin = {
  first_name: "Admin",
  last_name: "Coder",
  email: "adminCoder@coder.com",
  age: 0,
  password: "adminCod3r123",
  is_admin: true,
};

router.post("/register", async (req, res) => {
  let msg = "";
  const { first_name, last_name, age, email, password, confirm } = req.body;
  if (!first_name || !last_name || !age || !email || !password || !confirm) {
    msg = "Debe completar todos los campos";
    res.render("register", { msg });
  } else {
    if (password === confirm) {
      const exists = await um.getUser(email);
      if (exists) {
        msg = "Ya existe un usario con este correo electrónico";
        res.render("register", { msg });
      } else {
        const user = { first_name, last_name, age, email, password, is_admin: false };
        const addUser = await um.addUser(user);
        if (addUser) {
          req.session.user = user;
          res.redirect("/products");
        }
      }
    } else {
      msg = "Las contraseñas no coinciden";
      res.render("register", { msg });
    }
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  const user = await um.getUser(email);
  if (email === userCoderAdmin.email) {
    if (password === userCoderAdmin.password) {
      req.session.user = userCoderAdmin;
      res.redirect("/products");
    } else {
      let msg = "Constraseña incorrecta";
      res.render("login", { msg });
    }
  } else {
    if (user) {
      const userCred = await um.getUserByCreds(email, password);
      if (userCred) {
        req.session.user = user;
        res.redirect("/products");
      } else {
        let msg = "Constraseña incorrecta";
        res.render("login", { msg });
      }
    } else {
      res.redirect("/register");
    }
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    let msg = "Se cerró la sesión";
    res.render("login", { msg });
  });
});

export default router;

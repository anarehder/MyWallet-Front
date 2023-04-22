import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import axios from "axios";
import { useState } from "react";


export default function SignUpPage() {
  
  const BASE_URL = process.env.REACT_APP_API_URL;
  console.log(`${BASE_URL}cadastro`);

  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  console.log(form);
  
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    if (form.password === form.passwordConfirm) {
      const body = {name: form.name, email: form.email, password: form.password};
      const promise = axios.post(`${process.env.REACT_APP_API_URL}cadastro`, body);

      promise.then((resposta) => {
        console.log(resposta.data);
        navigate("/");
      });
      promise.catch((erro) => {
        alert(erro.response.data);
      });
  
    } else {
        alert("As senhas não coincidem")
    }  
  }

  return (
    <SingUpContainer>
      <form onSubmit={handleSubmit}>
        <MyWalletLogo />
        <input
          type="text"
          placeholder="Nome"
          name="name"
          onChange={handleChange}
          value={form.name}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          name="email"
          onChange={handleChange}
          value={form.email}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          name="password"
          onChange={handleChange}
          value={form.password}
          required
        />
        <input
          type="password"
          placeholder="Confirme a senha"
          name="passwordConfirm"
          onChange={handleChange}
          value={form.passwordConfirm}
          required
        />
        <button type="submit"> Cadastrar</button>
      </form>

      <Link to={"/"}>
        Já tem uma conta? Entre agora!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

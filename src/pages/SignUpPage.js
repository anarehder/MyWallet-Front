import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import axios from "axios";
import { useState } from "react";
import { ThreeDots } from 'react-loader-spinner';

export default function SignUpPage() {
  const [desabilitado, SetDesabilitado] = useState(false);

  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password === form.passwordConfirm) {
      SetDesabilitado(true);
      const body = { name: form.name, email: form.email, password: form.password };
      const promise = axios.post(`${process.env.REACT_APP_API_URL}/cadastro`, body);

      promise.then(() => {
        navigate("/");
      });
      promise.catch((erro) => {
        alert(erro.response.data);
        SetDesabilitado(false);
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
          disabled={desabilitado}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          name="email"
          onChange={handleChange}
          value={form.email}
          disabled={desabilitado}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          name="password"
          onChange={handleChange}
          value={form.password}
          disabled={desabilitado}
          required
        />
        <input
          type="password"
          placeholder="Confirme a senha"
          name="passwordConfirm"
          onChange={handleChange}
          value={form.passwordConfirm}
          disabled={desabilitado}
          required
        />
        <button type="submit" disabled={desabilitado}>
          {desabilitado === true ? <ThreeDots color="#FFFFFF" height="15px" width="100%" /> : "Cadastrar"}
        </button>
      </form>
      <Link to={"/"}>
        Já tem uma conta? Entre agora!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
  max-width: 325px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import MyWalletLogo from "../components/MyWalletLogo"
import { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from 'react-loader-spinner';

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [desabilitado, SetDesabilitado] = useState(false);
  const navigate = useNavigate();
  const lsUser = JSON.parse(localStorage.getItem("user"));
  const [, setUserDados] = useState(lsUser !== null ? lsUser : {});
  // colocar este no home page e transactions page ->  const [ , setUserDados] = useContext(UserContext);
  
  useEffect(() => {
    if (lsUser === null) {
      navigate("/");
    } else {
      navigate("/home");
    }
  }, [navigate,lsUser])

  function handleChange(e) {
    const itemAtualizado = { ...form, [e.target.name]: e.target.value }
    setForm(itemAtualizado);
  }

  function logar(e) {
    e.preventDefault()
    const body = form;
    SetDesabilitado(true);
    console.log(`${process.env.REACT_APP_API_URL}/login`)
    const promise = axios.post(`${process.env.REACT_APP_API_URL}/login`, body);

    promise.then(resposta => {
      console.log(resposta.data);
      const { userID, name, email, token } = resposta.data;
      setUserDados(resposta.data);
      localStorage.setItem("user", JSON.stringify({userID, name, email, token }));
      navigate("/home")
    })
    promise.catch(erro => {
      console.log(erro.response.data);
      alert(erro.response.data.message);
      SetDesabilitado(false);
    })
  }

  return (
    <SingInContainer>
      <form onSubmit={logar}>
        <MyWalletLogo />
        <input
          placeholder="E-mail"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          disabled={desabilitado}
          required
        />
        <input
          placeholder="Senha"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          disabled={desabilitado}
          required
        />
        <button type="submit" disabled={desabilitado}>
          {desabilitado === true ? <ThreeDots color="#FFFFFF" height="15px" width="100%" /> : "Entrar"}
        </button>
      </form>

      <Link to={"/cadastro"}>
        Primeira vez? Cadastre-se!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

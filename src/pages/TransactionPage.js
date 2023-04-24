import styled from "styled-components"
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useContext } from "react";
import { User } from "../contexts/UserContext";
import { ThreeDots } from 'react-loader-spinner';

export default function TransactionsPage() {
  const [form, setForm] = useState({ value: "", description: "" });
  const [desabilitado, SetDesabilitado] = useState(false);
  const navigate = useNavigate();
  const [userDados, ] = useContext(User);
  const {tipo} = useParams();

  const config = {
    headers: {
      "Authorization": `Bearer ${userDados.token}`
    }
  }

  function handleChange(e) {
    const itemAtualizado = { ...form, [e.target.name]: e.target.value }
    setForm(itemAtualizado);
  }

  function logar(e) {
    e.preventDefault()
    const formFormatado = {value: form.value.replace(",","."), description: form.description}

    const body = formFormatado;
    SetDesabilitado(true);
    const promise = axios.post(`${process.env.REACT_APP_API_URL}/nova-transacao/${tipo}`, body, config);
    promise.then(resposta => {
      console.log(resposta.data);
      navigate("/home")
    })
    promise.catch(erro => {
      console.log(erro.response.data);
      alert(erro.response.data);
      SetDesabilitado(false);
    })
  }

  return (
    <TransactionsContainer>
      <h1>Nova {tipo === "saida" ? "saída" : tipo}</h1>
      <form onSubmit={logar}>
        <input
          placeholder="Valor"
          type="text"
          name="value"
          value={form.value}
          onChange={handleChange}
          disabled={desabilitado}
          //required
        />
        <input
          placeholder="Descrição"
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={desabilitado}
          //required
        />
        <button type="submit" disabled={desabilitado}>
          {desabilitado === true ? <ThreeDots color="#FFFFFF" height="15px" width="100%" /> : `Salvar ${tipo === "saida" ? "saída" : tipo}`}
        </button>
      </form>
    </TransactionsContainer>
  )
}

const TransactionsContainer = styled.main`
  max-width: 370px;
  margin: 0 auto;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`

import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { useEffect, useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../contexts/UserContext";

export default function HomePage() {
  const [userDados, setUserDados] = useContext(User);
  const [listaGastos, setListaGastos] = useState([]);
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);

  let soma = 0;
  if (listaGastos.length > 0) {
    listaGastos.forEach((item) => (item.type === "entrada" ? soma += parseFloat(item.value) : soma -= parseFloat(item.value)))
  }

  const config = {
    headers: {
      "Authorization": `Bearer ${userDados.token}`
    }
  }

  useEffect(() => {
    setCarregando(true);
    const promise = axios.get(`${process.env.REACT_APP_API_URL}/operations`, config);
    promise.then(resposta => {
      setListaGastos(resposta.data);
      setCarregando(false);
    })
    promise.catch(erro => {
      alert(erro.response.data);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function logout() {
    const body = { "name": userDados.name }

    const promise = axios.post(`${process.env.REACT_APP_API_URL}/logout`, body, config);
    promise.then(resposta => {
      navigate("/")
      localStorage.removeItem("user")
      setUserDados({});
      alert(resposta.data)
    })
    promise.catch(erro => {
      alert(erro.response.data);
    })
  }

  function atualizaPagina() {
    window.location.reload(true)
  }

  setInterval(atualizaPagina, 120000);

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {userDados.name}</h1>
        <BiExit onClick={() => logout()} />
      </Header>
      {(carregando === false && listaGastos.length === 0) ? <SemGastos> Não há registros de entrada ou saída </SemGastos> :
        <TransactionsContainer>
          <ul>
            {listaGastos.map((item) =>
              <ListItemContainer key={item._id}>
                <div>
                  <span>{item.date.slice(0, 5)}</span>
                  <strong>{item.description}</strong>
                </div>
                <Value color={item.type === "entrada" ? "positivo" : "negativo"}>{parseFloat(item.value).toFixed(2).replace(".", ",")}</Value>
              </ListItemContainer>
            )}
          </ul>
          <article>
            <strong>Saldo</strong>
            <Value color={soma < 0 ? "negativo" : "positivo"}>
              {soma.toFixed(2).replace(".", ",")}
            </Value>
          </article>
        </TransactionsContainer>
      }

      <ButtonsContainer>
        <Link to={"/nova-transacao/entrada"}>
          <button >
            <AiOutlinePlusCircle />
            <p>Nova <br /> entrada</p>
          </button>
        </Link>
        <Link to={"/nova-transacao/saida"}>
          <button >
            <AiOutlineMinusCircle />
            <p>Nova <br />saída</p>
          </button>
        </Link>
      </ButtonsContainer>
    </HomeContainer>
  )
}

const HomeContainer = styled.div`
  width: 325px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  margin: 0 auto;
  width: 320px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 15px;
  height: 40px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  margin: 0 auto;
  width: 310px;
  height: calc(100vh - 240px);
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 5px 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ul{
    overflow-y: scroll;
  }
  ul::-webkit-scrollbar {
    width: 4px;               /* width of the entire scrollbar */
    border-radius: 20px;
    color: #a328d6;
  }

  ul::-webkit-scrollbar-track {
    background: #a328d6;        /* color of the tracking area */
    border-radius: 20px;  
  }
  article {
    display: flex;
    justify-content: space-between;   
    margin: 5px 15px;
    padding-top: 5px;
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`
const ButtonsContainer = styled.section`
  margin: 5px auto;
  width: 320px;
  height: 140px;
  display: flex;
  gap: 15px;
  a {
    padding: 0;
    width: 50%;
    button {
    margin-left: 0;
    width: 100%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 110px;
    p {
      font-size: 18px;
      }
    }
  }
`
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin: 5px 10px;
  min-height: 30px;
  line-height: 22px;
  div span {
    color: #c6c6c6;
    margin-right: 15px;
    word-break: break-word;
  }
  div {
    margin-right: 4px;
  }
`

const SemGastos = styled.div`
  margin: 0 auto;
  width: 280px;
  height: calc(100vh - 240px);
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  flex-grow: 1;
  color: #868686;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 22px;
  padding: 20px;
`
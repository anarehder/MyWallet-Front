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

  let soma = 0;
  if (listaGastos.length > 0) {
    listaGastos.forEach((item) => (item.type === "entrada" ? soma += parseFloat(item.value) : soma -= parseFloat(item.value)))
  }
  // {_id, value, description, type, date,userID}

  const config = {
    headers: {
      "Authorization": `Bearer ${userDados.token}`
    }
  }

  useEffect(() => {
    //console.log(config)
    const promise = axios.get(`${process.env.REACT_APP_API_URL}/operations`, config);
    promise.then(resposta => {
      setListaGastos(resposta.data);
    })
    promise.catch(erro => {
      console.log(erro.response.data);
      alert(erro.response.data);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function logout() {

    const body = {"name": userDados.name}
    console.log(body)

    const promise = axios.post(`${process.env.REACT_APP_API_URL}/logout`, body, config);
    promise.then(resposta => {
      console.log(resposta.data)
      navigate("/")
      localStorage.removeItem("user")
      setUserDados({});
      alert("O usuário fez logout!")
    })
    promise.catch(erro => {
      console.log(erro.response.data);
      alert(erro.response.data);
    })
  }

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {userDados.name}</h1>
        <BiExit onClick={() => logout()} />
      </Header>

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
  width: 370px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  margin: 0 auto;
  width: 350px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-top: 7px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  margin: 0 auto;
  width: 340px;
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px 5px;
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
    margin: 0 15px;
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`
const ButtonsContainer = styled.section`
  margin: 0 auto;
  width: 350px;
  display: flex;
  gap: 15px;
  a {
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
  line-height: 20px;
  div span {
    color: #c6c6c6;
    margin-right: 15px;
    word-break: break-word;
  }
  div {
    margin-right: 4px;
  }
`
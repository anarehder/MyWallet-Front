import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { useEffect, useContext, useState } from "react"
import axios from "axios";
import { User } from "../contexts/UserContext";

export default function HomePage() {
  const [userDados,] = useContext(User);
  const [listaGastos, setListaGastos] = useState([]);
  let soma = 0;
  if (listaGastos.length > 0){
    listaGastos.forEach((item) => (item.type === "entrada" ? soma += parseFloat(item.value) : soma-= parseFloat(item.value)))
  }
  // {_id, value, description, type, date,userID}
  console.log(userDados)

  useEffect(() => {
    const config = {
      headers: {
        "Authorization": `Bearer ${userDados.token}`
      }
    }
    const promise = axios.get(`${process.env.REACT_APP_API_URL}/operations`, config);
    /* {
      "_id": "644482ab57236e1e7f2c734a",
      "value": "150.00",
      "description": "Tia Cris",
      "type": "entrada",
      "date": "22/04/2023",
      "userID": "644330f39d52a22834f84b25"
    } */
    promise.then(resposta => {
      console.log(resposta.data);
      setListaGastos(resposta.data);
    })
    promise.catch(erro => {
      console.log(erro.response.data);
      alert(erro.response.data);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {userDados.name}</h1>
        <BiExit />
      </Header>

      <TransactionsContainer>
        <ul>
          {listaGastos.map((item) => 
            <ListItemContainer>
              <div>
                <span>{item.date.slice(0,5)}</span>
                <strong>{item.description}</strong>
              </div>
              <Value color={item.type === "entrada" ? "positivo":"negativo"}>{parseFloat(item.value).toFixed(2).replace(".",",") }</Value>
            </ListItemContainer>
          )}
        </ul>
        <article>
          <strong>Saldo</strong>
          <Value color={soma < 0 ? "negativo" : "positivo"}>
            {soma.toFixed(2).replace(".",",")}
          </Value>
        </article>
      </TransactionsContainer>


      <ButtonsContainer>
        <button>
          <AiOutlinePlusCircle />
          <p>Nova <br /> entrada</p>
        </button>
        <button>
          <AiOutlineMinusCircle />
          <p>Nova <br />saída</p>
        </button>
      </ButtonsContainer>

    </HomeContainer>
  )
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ul{
    overflow-y: scroll;
  }
  article {
    display: flex;
    justify-content: space-between;   
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;
  
  button {
    width: 50%;
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
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`
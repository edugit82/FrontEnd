import { useState } from 'react'
import './App.css'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ptBR } from 'date-fns/locale'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Registra o locale do português brasileiro
registerLocale('pt-BR', ptBR)

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    endereco: '',
    numero: '',
    cidade: '',
    estado: '',
    cep: '',
    genero: '',
    profissao: ''
  })

  // Função para formatar CPF no padrão XXX.XXX.XXX-XX
  const formatCPF = (cpf) => {
    // Remove todos os caracteres não numéricos
    cpf = cpf.replace(/\D/g, '')
    
    // Limita a 11 dígitos
    cpf = cpf.slice(0, 11)
    
    // Aplica a máscara
    if (cpf.length > 9) {
      return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
    } else if (cpf.length > 6) {
      return cpf.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3')
    } else if (cpf.length > 3) {
      return cpf.replace(/^(\d{3})(\d{1,3})$/, '$1.$2')
    }
    return cpf
  }

  // Função para formatar telefone no padrão brasileiro (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
  const formatTelefone = (telefone) => {
    // Remove tudo que não é dígito
    let numeros = telefone.replace(/\D/g, '')
    
    // Limita a 11 dígitos (DDD + 8 ou 9 dígitos)
    numeros = numeros.slice(0, 11)
    
    // Aplica a máscara progressivamente
    if (numeros.length <= 2) {
      return numeros
    } else if (numeros.length <= 6) {
      // Formato: (XX) XXXX
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
    } else if (numeros.length <= 10) {
      // Formato: (XX) XXXX-X
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
    } else {
      // Formato final: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
      const ddd = numeros.slice(0, 2)
      const prefix = numeros.slice(2, 7)
      const suffix = numeros.slice(7)
      return `(${ddd}) ${prefix.length === 5 ? prefix : prefix.slice(0,4)}-${suffix}`
    }
  }

  const formatCEP = (cep) => {
    // Remove tudo que não é dígito
    let numeros = cep.replace(/\D/g, '')
    
    // Limita a 8 dígitos (formato CEP brasileiro)
    numeros = numeros.slice(0, 8)
    
    // Aplica a máscara progressivamente
    if (numeros.length <= 5) {
      return numeros
    } else {
      // Formato: XXXXX-XXX
      return `${numeros.slice(0, 5)}-${numeros.slice(5)}`
    }
  }

  const formatNumero = (numero) => {
    // Remove tudo que não é dígito
    return numero.replace(/\D/g, '')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Aplica formatação específica para o CPF e telefone
    if (name === 'cpf') {
      setFormData({
        ...formData,
        [name]: formatCPF(value)
      })
    } else if (name === 'telefone') {
      setFormData({
        ...formData,
        [name]: formatTelefone(value)
      })
    } else if (name === 'cep') {
      setFormData({
        ...formData,
        [name]: formatCEP(value)
      })
    } else if (name === 'numero') {
      setFormData({
        ...formData,
        [name]: formatNumero(value)
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://20.57.128.211:8080/Client', formData)      
      console.log('Resposta do servidor:', response.data);
      toast.success('Cadastro realizado com sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    } catch (error) {
      console.error('Erro ao enviar dados:', error)
      toast.error('Erro ao cadastrar. Por favor, tente novamente.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }
  }

  return (
    <div className="container">
      <ToastContainer />
      <h1>Formulário de Cadastro Pessoal</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome Completo:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Digite apenas letras"
            maxLength={300}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exenplo@exemplo.com" 
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="XXX.XXX.XXX-XX"
            pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
            maxLength={20}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone:</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(XX) XXXX-XXXX ou (XX) XXXXX-XXXX"
            pattern="\(\d{2}\) \d{4,5}-\d{4}"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dataNascimento">Data de Nascimento:</label>
          <DatePicker
            id="dataNascimento"
            name="dataNascimento"
            selected={formData.dataNascimento ? new Date(formData.dataNascimento) : null}
            onChange={(date) => setFormData({...formData, dataNascimento: date ? date.toISOString().split('T')[0] : ''})}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            className="datepicker-input"
            placeholderText="Selecione uma data"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endereco">Endereço:</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="numero">Número:</label>
          <input
            type="text"
            id="numero"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            placeholder="Digite apenas números"
            pattern="\d{1,5}"
            maxLength={10}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="complemento">Complemento:</label>
          <input
            type="text"
            id="complemento"
            name="complemento"
            value={formData.complemento}
            onChange={handleChange}
            placeholder="Opcional"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cidade">Cidade:</label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado:</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cep">CEP:</label>
            <input
              type="text"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              placeholder="Digite apenas números"
              maxLength={15}
              pattern="\d{5}-\d{3}"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="genero">Gênero:</label>
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            required
          >
            <option value="">Selecione...</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
            <option value="prefiro-nao-informar">Prefiro não informar</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="profissao">Profissão:</label>
          <input
            type="text"
            id="profissao"
            name="profissao"
            value={formData.profissao}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Cadastrar</button>
      </form>
    </div>
  )
}

export default App

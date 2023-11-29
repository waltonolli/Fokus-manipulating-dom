// encontrar o botão adicionar tarefa

const btnAdicionarTarefa = document.querySelector('.app__button--add-task')
const formAdicionarTarefa = document.querySelector('.app__form-add-task')
const textarea = document.querySelector('.app__form-textarea')
const ulTarefas = document.querySelector('.app__section-task-list')
const btnCancelar = document.querySelector('.app__form-footer__button--cancel')
const tarefaAndamento = document.querySelector('.app__section-active-task-description')

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [] //verifica se já existem tarefas no localStorage. JSON.parse transforma a string da localStorage existente em um objeto. OU caso retorna nulo o valor na localStorage cria um array.

let tarefaSelecionada = null
let liTarefaSelecionada = null

function atualizarTarefas () {
    localStorage.setItem('tarefas', JSON.stringify(tarefas)) 
}

// adicionando um ouvinte de evento ao botão. Quando for clicado a função será executada
btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.remove('hidden') //altera a visibilidade do formulário (remove e adiciona a classe hidden)
})

btnCancelar.addEventListener('click', () => {
    formAdicionarTarefa.classList.add('hidden')
    formAdicionarTarefa.reset()
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault(); // previne o comportamento padrão do navegador/browser (neste caso ele recarrega a pagina)
    //Guarda o valor digitado no textarea dentro do objeto/variavel tarefa.
    const tarefa = {
        descricao: textarea.value //value busca o valor que está em textarea
    }
    tarefas.push(tarefa) // cria a tarefa
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas() //armazena a lista de tarefas como key 'tarefas' na localstorage, convertendo o array para uma string em formato JSON para poder armazenar.
    textarea.value = ''
    formAdicionarTarefa.classList.add('hidden')
})

//criando a tarefa

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
        <svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `

    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')

    botao.onclick = () => {
        //debugger // mostra no navegador qual linha do código está executando.
        // quando for clicado abrir o prompt para editar a tarefa.
        const novaDescricao = prompt("Qual é o novo nome da tarefa?") //substitui descrição da tarefa pelo prompt.
        //console.log('nova descrição da tarefa:', novaDescricao)
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            atualizarTarefas()
        }

    }

    const imagemBotao = document.createElement('img')
    imagemBotao.setAttribute('src', '/imagens/edit.png') 
    botao.append(imagemBotao); //adiciona a imagem do botao dentro do botao

    //adiciona os elementos dentro do li.
    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if(tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
    } else {
        li.onclick = () => { // para selecionar e tirar seleção da tarefa.
            document.querySelectorAll('.app__section-task-list-item-active')
            .forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active')
            })
    
            if (tarefaSelecionada == tarefa) {
                tarefaAndamento.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return // early return
            }
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            tarefaAndamento.textContent = tarefa.descricao //tarefa.descricao = tarefa é a constante, descricao é o item do objeto da constante
            li.classList.add('app__section-task-list-item-active')
        }
    }

    return li //retorna o elemento li
}

//percorrer a lista de tarefas na aplicação, e para cada tarefa, cria um elemento da tarefa.
tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
})


//ouve evento customizado - marca tarefa como cumprida

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled') //button porque só existe um botao na tarefa.
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

//removendo tarefas concluídas
const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item' // IF Ternario

    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [] //IF ternário
    atualizarTarefas()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true) //true ou false são argumentos
btnRemoverTodas.onclick = () => removerTarefas(false)
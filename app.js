const alunoList = document.querySelector("#aluno-list");

function renderAluno(doc) {
  let li = document.createElement("li");
  let nome = document.createElement("span");
  let cpf = document.createElement("span");
  let rg = document.createElement("span");
  let telefoneAluno = document.createElement("span");
  let telefoneResponsavel = document.createElement("span");
  let email = document.createElement("span");
  let dataNascimento = document.createElement("span");
  let turma = document.createElement("span");
  let excluir = document.createElement("span");
  excluir.classList.add("botao-exluir");
  excluir.textContent = "x";

  li.setAttribute("data-id", doc.id);
  nome.textContent = `Nome: ${doc.data().nome}`;
  cpf.textContent = `CPF: ${doc.data().cpf}`;
  rg.textContent = `RG: ${doc.data().rg}`;
  telefoneAluno.textContent = `Telefone do Aluno: ${doc.data().telefone_aluno}`;
  telefoneResponsavel.textContent = `Telefone do Responsável: ${
    doc.data().telefone_responsavel
  }`;
  email.textContent = `E-mail: ${doc.data().email}`;
  const dataNascimentoTimestamp = new Date(doc.data().data_nascimento);
  dataNascimento.textContent = `Data de Nascimento: ${dataNascimentoTimestamp.getDate()}/${
    dataNascimentoTimestamp.getMonth() + 1
  }/${dataNascimentoTimestamp.getFullYear()}`;

  const codTurmaRef = doc.data().cod_turma;
  if (codTurmaRef) {
    codTurmaRef
      .get()
      .then((turmaDoc) => {
        if (turmaDoc.exists) {
          turma.textContent = `Turma: ${turmaDoc.data().nome_turma}`;
        } else {
          turma.textContent = "Turma não encontrada";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  alunoList.appendChild(li);
  li.appendChild(excluir);
  li.appendChild(nome);
  li.appendChild(cpf);
  li.appendChild(rg);
  li.appendChild(telefoneAluno);
  li.appendChild(telefoneResponsavel);
  li.appendChild(email);
  li.appendChild(dataNascimento);
  li.appendChild(turma);

  excluir.addEventListener("click", (event) => {
    event.stopPropagation();
    let id = event.target.parentElement.getAttribute("data-id");
    db.collection("aluno")
      .doc(id)
      .delete()
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erro ao excluir aluno:", error);
      });
  });
}

db.collection("aluno")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      renderAluno(doc);
    });
  });

const form = document.querySelector("#add-aluno-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const codTurmaId = form.cod_turma.value;
  const turmaRef = db.collection("turmas").doc(codTurmaId);

  db.collection("aluno")
    .add({
      nome: form.nome.value,
      cpf: form.cpf.value,
      rg: form.rg.value,
      telefone_aluno: form.telefone_aluno.value,
      telefone_responsavel: form.telefone_responsavel.value,
      email: form.email.value,
      data_nascimento: new Date(form.data_nascimento.value),
      cod_turma: turmaRef,
    })
    .then(() => {
      form.reset();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro ao adicionar aluno:", error);
    });
});

const selectTurma = document.getElementById("cod_turma");

function renderTurmas() {
  selectTurma.innerHTML = "";

  db.collection("turmas")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const option = document.createElement("option");
        option.value = doc.id;
        option.textContent = doc.data().nome_turma;
        selectTurma.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar as turmas:", error);
      const errorOption = document.createElement("option");
      errorOption.textContent = "Erro ao carregar turmas";
      selectTurma.appendChild(errorOption);
    });
}
window.onload = renderTurmas;

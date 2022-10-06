let items = [];

// Tæller antal tegn i text-area
//Create form
function openForm() {
  document.getElementById("myForm").style.display = "block";

  var textarea = document.querySelector("textarea");
  textarea.addEventListener("input", () => {
    document.getElementById("count").textContent = textarea.value.length;
  });
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

const sendPost = async () => {
  const message = document.getElementById("textarea").value;
  const username = document.getElementById("username").value;

  // Send postrequest
  const result = await fetch("http://127.0.0.1:8000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Besked: message,
      Brugernavn: username,
    }),
  });
}
//Slet funktion 
const deletePip = async (id) => {
  const result = await fetch("http://127.0.0.1:8000/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });
  await fetchAll();
  location.reload();
};

// Update form
function openUpdateForm(){
  document.getElementById("update_myForm").style.display = "block";

  const textarea = document.querySelector("#update_textarea");
    textarea.addEventListener("input", ()=> {
      document.getElementById("update_count").textContent = textarea.value.length;
    })
}

function closeUpdateForm(){
  document.getElementById("update_myForm").style.display = "none";
}

//Update funktion 
const updatePip = async (id, brugernavn, besked) => {
  const result = await fetch("http://127.0.0.1:8000/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id, brugernavn: brugernavn, besked: besked}),
  });
  
  await fetchAll();
  location.reload();
};


function startUpdateProcess(id, brugernavn, besked) {
  // Åbner en ny modal.
  openUpdateForm()
  console.log(id, brugernavn, besked)

  // Felterne i modalen hiver fat i ID'erne, og sætter value  
  document.querySelector("#update_username").value = brugernavn
  document.querySelector("#update_textarea").value = besked

  //Hiver fat i hele formen 
  const form = document.querySelector("#update_myForm");
  //Hiver fat i submit (knappen)
  form.addEventListener("submit", (event)=> {
    event.preventDefault()
    const nyBrugernavn = document.getElementById("update_username").value
    const nyBesked = document.getElementById("update_textarea").value
    console.log(id, nyBesked, nyBrugernavn)

    //Kalder på vores update funktion 
    updatePip(id, nyBrugernavn, nyBesked);

  })


}

const fetchAll = async () => {
  const result = await fetch(
    //EKSEMPEL "localhost:3036"
    "http://127.0.0.1:8000/"
  );
  // Result er det overordnede HTTP response
  // Her får vi data:
  const data = await result.json();

  // the new array
  items = [];
  // Traditionelt for loop
  //
  for (let item in data) {
    // Do not worry about this.
    items.push(data[item]);
  }
  // But the result is an array:

  // Modern for loops
  items.forEach((item) => {
    const brugernavn = item.Brugernavn;
    const besked = item.Besked;
    const element = `<div class="midten">
      <img src="https://avatars.dicebear.com/api/avataaars/:${brugernavn}.svg" class="avatar" alt="">
        <h3>${brugernavn}</h3>
        <p>Siger: ${besked}</p>
        <div class=buttons> 
        <button class=button value="delete" onclick="deletePip(${item.idnew_table})"> Slet </button>
        <button class=button value="update" onclick="startUpdateProcess(${item.idnew_table}, '${brugernavn}', '${besked}')"> Update </button>
        </div>
       </div>`;

    //  henvis til andet div kig på
    const div = document.querySelector(".midterdiv");
    div.innerHTML = div.innerHTML + element;
  });
}

// Load event listener med arrow function
window.addEventListener("load", async () => {
  await fetchAll()
});


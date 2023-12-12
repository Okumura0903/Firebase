import {getFirestore,collection,addDoc,getDocs,onSnapshot,doc,updateDoc,deleteDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
const db=getFirestore();
const dbRef=collection(db,"contacts");

// MOBILE VIEW
const leftCol = document.querySelector("#left-col");
const rightCol = document.querySelector("#right-col");
const backBtn = document.querySelector("#back-btn");
backBtn.addEventListener('click',e=>{
  leftCol.style.display="block";
  rightCol.style.display="none";
});

const toggleLeftAndRightViewsOnMobile = ()=>{
  if(document.body.clientWidth <= 600){
    leftCol.style.display="none";
    rightCol.style.display="block";
  }
};


// GET DATA
let contacts=[];
const getContacts=async()=>{
  try{
    // const docsSnap = await getDocs(dbRef);
    await onSnapshot(dbRef,docsSnap=>{
      contacts=[];
      docsSnap.forEach((doc)=>{
        const contact = doc.data();
        contact.id = doc.id;
        contacts.push(contact);
      });
      showContacts(contacts);
    });
  } catch(err){

  }
};

getContacts();

// SHOW CONTACT
const contactList =  document.querySelector("#contact-list");
const showContacts=(contacts)=>{
  contactList.innerHTML="";
  contacts.forEach((contact)=>{
  const li=`
    <li class="contact-list-item" id="${contact.id}">
          <div class="media">
            <div class="two-letters">AB</div>
          </div>
          <div class="content">
            <div class="title">${contact.firstname} ${contact.lastname}</div>
            <div class="subtitle">${contact.email}</div>
          </div>
          <div class="action">
            <button class="edit-user">edit</button>
            <button class="delete-user">delete</button>
          </div>
    </li> 
  `;
  contactList.innerHTML+=li;
  });
};

// CLICK CONTACT LIST
const getContact=(id)=>{
  return contacts.find((contact)=>{
    return contact.id===id;
  });
}

const displayContactOnDetailsView=(id)=>{
  const contact = getContact(id);
  const rightColDetail =  document.querySelector("#right-col-detail");
  rightColDetail.innerHTML=`
  <div class="label">Name:</div>
  <div class="data">${contact.firstname} ${contact.lastname}</div>
  <div class="label">Age:</div>
  <div class="data">${contact.age}</div>
  <div class="label">Phone:</div>
  <div class="data">${contact.phone}</div>
  <div class="label">Email:</div>
  <div class="data">${contact.email}</div>
  `;
}

const contactListPressed=(event)=>{
  const id=event.target.closest("li").getAttribute("id")

  if(event.target.className==="edit-user"){
    editButtonPressed(id);
  }
  else if(event.target.className==="delete-user"){
    deleteButtonPressed(id);
  }
  else{
    displayContactOnDetailsView(id);
    toggleLeftAndRightViewsOnMobile();
  }
};

contactList.addEventListener('click',contactListPressed)

// DELETE DATA
const deleteButtonPressed=async(id)=>{
  const inConfirmed = confirm("削除しますか？");
  if(!inConfirmed){
    return;
  }
  try{
    const docRef = doc(db,"contacts",id);
    await deleteDoc(docRef);
  } catch(e){
    setErrorMessage("eroror","Unable to delete data from the database");
    showErrorMessages();
  }
}

// EDIT DATA
const editButtonPressed=(id)=>{
  modalOverlay.style.display="flex";
  const contact=getContact(id);
  firstname.value=contact.firstname;
  lastname.value=contact.lastname;
  age.value=contact.age;
  phone.value=contact.phone;
  email.value=contact.email;

  modalOverlay.setAttribute("contact-id",contact.id);
};

const addBtn =  document.querySelector(".add-btn");
const modalOverlay =  document.querySelector("#modal-overlay");
const closeBtn =  document.querySelector(".close-btn");

const addButtonPressed=()=>{
  modalOverlay.style.display="flex";
  modalOverlay.removeAttribute("contact-id");
  firstname.value="";
  lastname.value="";
  age.value="";
  phone.value="";
  email.value="";
};

const closeButtonPressed=()=>{
  modalOverlay.style.display="none";
};

const hideModal=(e)=>{
  if(e instanceof Event){
    if(e.target===e.currentTarget){
      modalOverlay.style.display="none";
    }
  }
  else{
    modalOverlay.style.display="none";
  }
};

addBtn.addEventListener('click',addButtonPressed);
closeBtn.addEventListener('click',closeButtonPressed);
modalOverlay.addEventListener('click',hideModal);

// FPRM VALIDATION
const saveBtn =  document.querySelector(".save-btn");
const error={};

const firstname =  document.querySelector("#firstname");
const lastname =  document.querySelector("#lastname");
const age =  document.querySelector("#age");
const phone =  document.querySelector("#phone");
const email =  document.querySelector("#email");

const checkRequired=(inputArray)=>{
  inputArray.forEach(input => {
    if(input.value.trim() === ""){
      setErrorMessage(input,input.id+" is empty");
    }
    else{
      deleteErrorMessage(input);
    }
  });
}

const showErrorMessages=()=>{
  const errorLabel =  document.querySelector("#error-label");
  errorLabel.innerHTML="";
  for(const key in error){
    const li = document.createElement("li");
    li.innerText = error[key];
    li.style.color="red";
    errorLabel.appendChild(li);
  }
};

const setErrorMessage=(input,message)=>{
  if(input.nodeName==="INPUT"){
    error[input.id]=message;
    input.style.border="1px solid red";
  }
  else{
    error[input]=message;
  }
};
const deleteErrorMessage=(input)=>{
  delete error[input.id];
  input.style.border="1px solid green";
};
const checkInputLength=(input,number)=>{
  if(input.value.trim()!==""){
    if(input.value.trim().length===number){
      deleteErrorMessage(input);
    }
    else{
      setErrorMessage(input,input.id+` must be ${number} digits`);
    }
  }
}

const checkEmail=(input)=>{
  if(input.value.trim()!==""){
    const re = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    if(re.test(input.value.trim())){
      deleteErrorMessage(input);
    }
    else{
      setErrorMessage(input,input.id+" is invalid");
    }
  }
};


const saveButtonPressed=async()=>{
  checkRequired([firstname,lastname,email,age,phone]);
  checkEmail(email);
  checkInputLength(age,2);
  checkInputLength(phone,10);
  showErrorMessages();

  if(Object.keys(error).length===0){
    if(modalOverlay.getAttribute("contact-id")){
      const docRef = doc(db,"contacts",modalOverlay.getAttribute("contact-id"));
      try{
        await updateDoc(docRef,{
          firstname:firstname.value,
          lastname:lastname.value,
          age:age.value,
          phone:phone.value,
          email:email.value
        });
        hideModal();
      } catch(e){
        setErrorMessage("eroror","Unable to update data to the database");
        showErrorMessages();
      }
    }
    else{
      try{
        await addDoc(dbRef,{
          firstname:firstname.value,
          lastname:lastname.value,
          age:age.value,
          phone:phone.value,
          email:email.value
        });
        hideModal();
      } catch(err){
        setErrorMessage("error","Unable to add data to the database.");
        showErrorMessages();
      }
    }
  }
};

saveBtn.addEventListener('click',saveButtonPressed);


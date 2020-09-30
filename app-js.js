


var educList = document.querySelector('#educdata');
// create element and render education
function renderEduc(doc){
    let newli = document.createElement('li');
    let degree = document.createElement('span');
    let school = document.createElement('span');
    let year_End = document.createElement('span');
    let year_Start = document.createElement('span');
    let saxis = document.createElement('button');

    degree.setAttribute('id', 'degstyle');
    school.setAttribute('id','schoolstyle');
    newli.setAttribute('id','edLi');
    saxis.setAttribute('id', 'deleting');

    newli.setAttribute('data-id', doc.id);
    degree.textContent = "Degree: " +doc.data().degree;
    school.textContent = "School: " +doc.data().school;
    year_End.textContent = "End: " + doc.data().year_end;
    year_Start.textContent = "Start: " +doc.data().year_start;
    saxis.textContent = "Delete Entry";

    newli.appendChild(degree);
    newli.appendChild(school);
    newli.appendChild(year_End);
    newli.appendChild(year_Start);
    newli.appendChild(saxis);
    
    educList.appendChild(newli);

    saxis.addEventListener('click',(e) =>{
        let lid = e.target.parentElement.getAttribute('data-id');
        db.collection("educations").doc(lid).delete().then(function(){
            alert("Education deleted!");
        }).catch(function(err){
            alert("Education not Deleted");
        })
    })
}
    
db.collection('educations').get().then((snapshot)=>{
    snapshot.docs.forEach(doc =>{
        renderEduc(doc);
    })
})

var orgList = document.querySelector('#orgdata');

function renderOrg(doc){
    let bli = document.createElement('li');
    let name = document.createElement('span');
    let position = document.createElement('span');
    let yrend = document.createElement('span');
    let yrstart= document.createElement('span');
    let saxis = document.createElement('button');

    bli.setAttribute('id','orgLi');
    saxis.setAttribute('id', 'deleting');
    bli.setAttribute('data-id', doc.id);

    name.textContent ="Name: " +doc.data().name;
    position.textContent ="Position: " +doc.data().position;
    yrend.textContent ="End: " +doc.data().yrend;
    yrstart.textContent ="Start: " +doc.data().yrstart;
    saxis.textContent = "Delete Entry";

    bli.appendChild(name);
    bli.appendChild(position);
    bli.appendChild(yrend);
    bli.appendChild(yrstart);
    bli.appendChild(saxis);

    orgList.appendChild(bli);

    saxis.addEventListener('click',(e) =>{
        let lid = e.target.parentElement.getAttribute('data-id');
        db.collection("organizations").doc(lid).delete().then(function(){
            alert("Organization deleted!");
        }).catch(function(err){
            alert("Organization not deleted!");
        })
    })

}

db.collection('organizations').get().then((snapshot)=>{
    snapshot.docs.forEach(doc =>{
        renderOrg(doc);
    })
})

var workList = document.querySelector('#workdata');

function renderWork(doc){
    let newli = document.createElement('li');
    let mp_name = document.createElement('span');
    let subject = document.createElement('span');
    let saxis = document.createElement('button');

    newli.setAttribute('id', 'workLi');
    newli.setAttribute('data-id', doc.id);
    saxis.setAttribute('id', 'deleting');

    mp_name.textContent = "Project Name: " +doc.data().mp_name;
    subject.textContent = "Subject: " +doc.data().subject;
    saxis.textContent = "Delete Entry";

    newli.appendChild(mp_name);
    newli.appendChild(subject);
    newli.appendChild(saxis);
    workList.appendChild(newli); 
    
    saxis.addEventListener('click',(e) =>{
        let lid = e.target.parentElement.getAttribute('data-id');
        db.collection("works").doc(lid).delete().then(function(){
            alert("Work deleted!");
        }).catch(function(err){ 
            alert("Work not deleted!");
        })
    })
    
}

db.collection('works').get().then((snapshot)=>{
    snapshot.docs.forEach(doc =>{
        renderWork(doc);
    })
})

    

var otherList = document.querySelector('#otherdata');


function renderOther(doc){
    let newli = document.createElement('li');
    let about = document.createElement('p');
    let name = document.createElement('span');
    let phone = document.createElement('span');
    let email = document.createElement('span');

    newli.setAttribute('id', 'otherLi');
    newli.setAttribute('data-id', doc.id);
    about.textContent = doc.data().about;
    name.textContent = doc.data().name;
    phone.textContent = doc.data().phone;
    email.textContent = doc.data().email;

    newli.appendChild(about);
    newli.appendChild(name);
    newli.appendChild(email);
    newli.appendChild(phone);
    
    otherList.appendChild(newli);
}

db.collection('others').get().then((snapshot)=>{
    snapshot.docs.forEach(doc =>{
        renderOther(doc);
    })
})

var educform = document.querySelector('#educ-form');

// saving data
educform.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('educations').add({
        degree: educform.eDegree.value,
        school: educform.eSchool.value,
        year_end: educform.eSchoolend.value,
        year_start: educform.eSchoolstart.value
        
    });
    educform.eDegree.value = '';
    educform.eSchool.value ='';
    educform.eSchoolend.value='';
    educform.eSchoolstart.value='';
    alert("Education Added!");
})

var orgform = document.querySelector('#org-form');

// saving data
orgform.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('organizations').add({
        name: orgform.oname.value,
        position: orgform.oposition.value,  
        yrend: orgform.oyrend.value,
        yrstart: orgform.oyrstart.value        
    })
    orgform.oname.value ='';
    orgform.oposition.value ='';
    orgform.oyrend.value ='';
    orgform.oyrstart.value='';
    alert("Organization Added!");
})

var workform = document.querySelector('#work-form');

workform.addEventListener('submit', (e)=> {
    e.preventDefault();
    db.collection('works').add({
        mp_name: workform.wname.value,
        subject: workform.wsubject.value 
        
    })
    workform.wname.value = '';
    workform.wsubject.value= '';
    alert("Work Added!");
})